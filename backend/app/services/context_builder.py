from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import date
from typing import Any, Dict, List, Optional

from app.services.metrics_service import fetch_timeseries
from services.reviews_service import get_review_summary, list_recent_reviews
from services.policy_service import (
    list_policy_recommendations,
    list_policy_products,
)
from app.services import rag_indexer

FINANCE_KEYWORDS = [
    "금융",
    "자금",
    "대출",
    "적금",
    "예금",
    "카드",
    "보증",
    "운영자금",
]

logger = logging.getLogger(__name__)


@dataclass
class ContextBundle:
    contexts: List[str] = field(default_factory=list)
    sources: List[Dict[str, Optional[str]]] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    reviews: Dict[str, Any] = field(default_factory=dict)
    policies: Dict[str, Any] = field(default_factory=dict)
    documents: List[Dict[str, Any]] = field(default_factory=list)
    meta: Dict[str, Any] = field(default_factory=dict)


def _is_finance_intent(query: str) -> bool:
    lowered = query.lower()
    return any(keyword in lowered for keyword in FINANCE_KEYWORDS)


def _summarise_metrics(series: List[Dict[str, Any]]) -> Optional[str]:
    if not series:
        return None
    start = series[0]["x"]
    end = series[-1]["x"]
    total_points = len(series)
    latest = series[-1]["y"]
    return (
        f"[매출 추이] {start}~{end}, {total_points}일 데이터, 최근 순매출 {int(latest):,}원"
    )


def build_context(
    query: str,
    business_id: Optional[str],
    *,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    top_k_docs: int = 5,
) -> ContextBundle:
    bundle = ContextBundle()
    finance_intent = _is_finance_intent(query)

    # Metrics
    series: List[Dict[str, Any]] = []
    stats: Dict[str, Optional[float]] = {"moving_avg_7": None, "pct_change_7d": None}
    if business_id:
        series, stats = fetch_timeseries(business_id, date_from, date_to)
        if series:
            bundle.contexts.append(_summarise_metrics(series))
            bundle.sources.append(
                {
                    "type": "sql",
                    "name": "public.metrics_daily",
                    "meta": {
                        "business_id": business_id,
                        "from": series[0]["x"],
                        "to": series[-1]["x"],
                    },
                }
            )
        bundle.metrics = {"series": series, "stats": stats}

    # Reviews
    if business_id:
        try:
            summary = get_review_summary(business_id)
            if summary and summary.get("review_count"):
                bundle.reviews = summary
                bundle.contexts.append(
                    (
                        f"[리뷰 요약] 총 {summary['review_count']}건, 평균 {summary['average_rating']:.2f}점, "
                        f"부정 {summary['negative_count']}건"
                    )
                )
                recent_reviews = list_recent_reviews(business_id, limit=3)
                if recent_reviews:
                    for review in recent_reviews:
                        content = (review.get("content") or "").strip()
                        rating = review.get("rating")
                        if content:
                            bundle.contexts.append(f"리뷰 ({rating}점): {content[:160]}")
                bundle.sources.append(
                    {
                        "type": "sql",
                        "name": "public.reviews",
                        "meta": {
                            "business_id": business_id,
                            "review_count": str(summary.get("review_count")),
                            "average_rating": f"{summary.get('average_rating', 0):.2f}",
                        },
                    }
                )
        except Exception as exc:  # pragma: no cover
            logger.warning("Failed to build review context: %s", exc)

    # Policies
    policy_meta: Dict[str, Any] = {}
    try:
        policy_entries: List[Dict[str, Any]] = []
        if business_id:
            recommendations = list_policy_recommendations(business_id)
            if recommendations:
                for rec in recommendations:
                    policy_entries.append(rec)
        if not policy_entries:
            grouped_products = list_policy_products(limit=5, query_text=query if finance_intent else None)
            for group in grouped_products:
                for product in group.get("products", []):
                    policy_entries.append(product)

        policy_names = [item.get("name") for item in policy_entries if item.get("name")]
        top_policy_names = [name for name in policy_names[:3] if name]
        if top_policy_names:
            policy_meta["top_products"] = top_policy_names
            bundle.contexts.append(f"[추천 금융 상품] {', '.join(top_policy_names)}")
        if policy_entries:
            bundle.policies = {"items": policy_entries}
            bundle.sources.append(
                {
                    "type": "sql",
                    "name": "public.policy_products",
                    "meta": {
                        "top_products": ", ".join(top_policy_names),
                    },
                }
            )
    except Exception as exc:  # pragma: no cover
        logger.warning("Failed to build policy context: %s", exc)

    # Documents
    documents = rag_indexer.vector_search(query, top_k=top_k_docs)
    if documents:
        bundle.documents = documents
        for doc in documents:
            metadata = doc.get("metadata") or {}
            snippet = doc.get("page_content", "")
            source_name = str(metadata.get("source") or "document")
            if snippet:
                bundle.contexts.append(f"[문서] {source_name}: {snippet[:300]}")
            bundle.sources.append(
                {
                    "type": "doc",
                    "name": source_name,
                    "meta": {k: str(v) for k, v in metadata.items()},
                }
            )

    # Meta for prompt
    bundle.meta = {
        "business_id": business_id or "",
        "business_category": "",
        "region": "",
        "today": date.today().isoformat(),
        "metrics_window": len(series) if series else 0,
        "reviews_window": 30,
        "policy_keywords": ", ".join([kw for kw in FINANCE_KEYWORDS if kw in query]),
        "policy_group": policy_meta.get("top_products", [None])[0] if policy_meta.get("top_products") else "",
        "top_k_docs": len(documents),
    }

    return bundle

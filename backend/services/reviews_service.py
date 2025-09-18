from typing import Any, Dict, List
from collections import Counter

from .supabase_client import supabase


def get_review_summary(business_id: str) -> Dict[str, Any]:
    response = (
        supabase.table("review_summary")
        .select("business_id, review_count, average_rating, positive_count, neutral_count, negative_count")
        .eq("business_id", business_id)
        .single()
        .execute()
    )
    data = response.data or {}
    return {
        "business_id": business_id,
        "review_count": int(data.get("review_count") or 0),
        "average_rating": float(data.get("average_rating") or 0),
        "positive_count": int(data.get("positive_count") or 0),
        "neutral_count": int(data.get("neutral_count") or 0),
        "negative_count": int(data.get("negative_count") or 0),
    }


def list_recent_reviews(business_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    response = (
        supabase.table("reviews")
        .select("rating, content, source, reviewed_at")
        .eq("business_id", business_id)
        .order("reviewed_at", desc=True)
        .limit(limit)
        .execute()
    )
    items = response.data or []
    for item in items:
        item["rating"] = float(item.get("rating") or 0)
    return items


def list_all_reviews(business_id: str, limit: int = 100) -> List[Dict[str, Any]]:
    response = (
        supabase.table("reviews")
        .select("rating, content, source, reviewed_at")
        .eq("business_id", business_id)
        .order("reviewed_at", desc=True)
        .limit(limit)
        .execute()
    )
    items = response.data or []
    for item in items:
        item["rating"] = float(item.get("rating") or 0)
    return items


def review_source_breakdown(business_id: str) -> List[Dict[str, Any]]:
    response = (
        supabase.table("reviews")
        .select("source")
        .eq("business_id", business_id)
        .execute()
    )
    items = response.data or []
    counter = Counter(item.get("source") or "기타" for item in items)
    total = sum(counter.values()) or 1
    return [
        {"source": source, "count": count, "ratio": round(count / total, 4)}
        for source, count in counter.items()
    ]

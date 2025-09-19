from typing import Any, Dict, List, Optional

from .supabase_client import supabase

STATUS_COLORS = {
    "진행중": "#1D4ED8",
    "승인": "#15803D",
    "거절": "#DC2626",
    "마감": "#737373",
    "보류": "#F59E0B",
}


def _split_features(value: Optional[str]) -> List[str]:
    if not value:
        return []
    separators = [";", "\n", "|"]
    features = [value]
    for sep in separators:
        if sep in value:
            features = [item.strip() for item in value.split(sep)]
            break
    return [item for item in (f.strip() for f in features) if item]


def list_policy_recommendations(business_id: str) -> List[Dict[str, Any]]:
    response = (
        supabase.table("policy_recommendations")
        .select("id, policy_id, rationale, priority, policy_products(name, group_name, limit_amount, interest_rate, term, eligibility, documents, application_method)")
        .eq("business_id", business_id)
        .order("priority", desc=False)
        .execute()
    )
    items = response.data or []
    results: List[Dict[str, Any]] = []
    for item in items:
        product = item.get("policy_products") or {}
        features = _split_features(product.get("documents")) or _split_features(product.get("application_method"))
        results.append(
            {
                "recommendation_id": item.get("id"),
                "policy_id": item.get("policy_id"),
                "name": product.get("name"),
                "group_name": product.get("group_name"),
                "limit_amount": product.get("limit_amount"),
                "interest_rate": product.get("interest_rate"),
                "term": product.get("term"),
                "eligibility": product.get("eligibility"),
                "documents": product.get("documents"),
                "application_method": product.get("application_method"),
                "rationale": item.get("rationale"),
                "priority": item.get("priority"),
                "features": features,
            }
        )
    return results


def list_policy_workflows(business_id: str) -> List[Dict[str, Any]]:
    response = (
        supabase.table("policy_applications")
        .select("policy_id, status, notes, updated_at, policy_products(name, group_name, limit_amount, interest_rate, term, eligibility, documents, application_method)")
        .eq("business_id", business_id)
        .execute()
    )
    items = response.data or []
    workflows: List[Dict[str, Any]] = []
    for item in items:
        product = item.get("policy_products") or {}
        status = item.get("status")
        workflows.append(
            {
                "policy_id": item.get("policy_id"),
                "status": status,
                "status_color": STATUS_COLORS.get(status or "", "#1F2937"),
                "notes": item.get("notes"),
                "updated_at": item.get("updated_at"),
                "product": product,
            }
        )
    return workflows


def list_policy_products(
    group_name: str | None = None,
    query_text: str | None = None,
    limit: int = 20,
) -> List[Dict[str, Any]]:
    builder = supabase.table("policy_products").select(
        "id, name, group_name, limit_amount, interest_rate, term, eligibility, documents, application_method"
    )
    if group_name:
        builder = builder.eq("group_name", group_name)
    if query_text:
        pattern = f"%{query_text}%"
        builder = builder.or_(
            "name.ilike.{pattern},eligibility.ilike.{pattern}"
            .replace("{pattern}", pattern)
        )
    if limit:
        builder = builder.limit(limit)

    response = builder.order("group_name", desc=False).execute()
    rows = response.data or []

    grouped: Dict[str, List[Dict[str, Any]]] = {}
    for row in rows:
        group = row.get("group_name") or "기타"
        features = _split_features(row.get("documents"))
        if not features:
            features = _split_features(row.get("application_method"))
        product_payload = {
            "id": row.get("id"),
            "name": row.get("name"),
            "group_name": group,
            "limit_amount": row.get("limit_amount"),
            "interest_rate": row.get("interest_rate"),
            "term": row.get("term"),
            "eligibility": row.get("eligibility"),
            "application_method": row.get("application_method"),
            "features": features,
            "documents": row.get("documents"),
        }
        grouped.setdefault(group, []).append(product_payload)

    return [
        {"group_name": group, "products": products}
        for group, products in grouped.items()
    ]

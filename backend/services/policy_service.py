from typing import Any, Dict, List

from .supabase_client import supabase

STATUS_COLORS = {
    "진행중": "#1D4ED8",
    "승인": "#15803D",
    "거절": "#DC2626",
    "마감": "#737373",
    "보류": "#F59E0B",
}


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

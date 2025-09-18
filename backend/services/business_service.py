from typing import Any, Dict, Optional

from .supabase_client import supabase


def upsert_business(
    owner_id: str,
    store_name: str,
    business_code: str,
    industry: Optional[str] = None,
) -> Dict[str, Any]:
    payload = {
        "owner_id": owner_id,
        "name": store_name,
        "business_code": business_code,
        "industry": industry,
    }
    payload = {k: v for k, v in payload.items() if v is not None}
    response = (
        supabase.table("businesses")
        .upsert(payload, on_conflict="business_code", returning="representation")
        .execute()
    )
    data = response.data[0] if response.data else None
    if not data:
        fetched = (
            supabase.table("businesses")
            .select("*")
            .eq("business_code", business_code)
            .single()
            .execute()
        )
        data = fetched.data or {}

    if data and owner_id:
        supabase.table("businesses").update({"owner_id": owner_id}).eq("id", data.get("id")).execute()

    return data or {}

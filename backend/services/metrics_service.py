from typing import Any, Dict, Optional

from .supabase_client import supabase

DATA_DELAY_NOTICE = "국세청 홈택스 연동으로 1~2일 지연될 수 있어요."


def get_metrics_summary(business_id: str) -> Dict[str, Any]:
    """Fetch aggregated metrics for a given business from Supabase."""
    response = supabase.rpc("metrics_latest_summary", {"target_business": business_id}).execute()
    data: Optional[Dict[str, Any]] = None
    if isinstance(response.data, list) and response.data:
        data = response.data[0]
    elif isinstance(response.data, dict):
        data = response.data

    if not data:
        return {
            "business_id": business_id,
            "latest_date": None,
            "gross_sales": 0,
            "net_sales": 0,
            "cost_of_goods": 0,
            "profit": 0,
            "settlement_delay": 0,
            "data_delay_notice": DATA_DELAY_NOTICE,
        }

    return {
        "business_id": data.get("business_id", business_id),
        "latest_date": data.get("latest_date"),
        "gross_sales": float(data.get("gross_sales") or 0),
        "net_sales": float(data.get("net_sales") or 0),
        "cost_of_goods": float(data.get("cost_of_goods") or 0),
        "profit": float(data.get("profit") or 0),
        "settlement_delay": int(data.get("settlement_delay") or 0),
        "data_delay_notice": data.get("data_delay_notice") or DATA_DELAY_NOTICE,
    }


def list_metrics_daily(business_id: str, limit: int = 30) -> Dict[str, Any]:
    r = (
        supabase.table("metrics_daily")
        .select("metric_date, gross_sales, net_sales, cost_of_goods, settlement_delay_count")
        .eq("business_id", business_id)
        .order("metric_date", desc=True)
        .limit(limit)
        .execute()
    )
    items = r.data or []
    for item in items:
        item["gross_sales"] = float(item.get("gross_sales") or 0)
        item["net_sales"] = float(item.get("net_sales") or 0)
        item["cost_of_goods"] = float(item.get("cost_of_goods") or 0)
        item["settlement_delay_count"] = int(item.get("settlement_delay_count") or 0)
    return {"items": items, "data_delay_notice": DATA_DELAY_NOTICE}

import types

from services import metrics_service


class DummyResponse:
    def __init__(self, data):
        self.data = data

    def execute(self):
        return self


class DummySupabase:
    def __init__(self, rpc_data=None, table_data=None):
        self._rpc_data = rpc_data
        self._table_data = table_data or []

    def rpc(self, name, params):
        assert name == "metrics_latest_summary"
        return DummyResponse(self._rpc_data)

    def table(self, name):
        self._table_name = name
        return self

    def select(self, *_args, **_kwargs):
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def order(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def execute(self):
        return DummyResponse(self._table_data)


def test_metrics_summary_defaults(monkeypatch):
    dummy = DummySupabase(rpc_data=[])
    monkeypatch.setattr(metrics_service, "supabase", dummy)
    result = metrics_service.get_metrics_summary("biz-1")
    assert result["business_id"] == "biz-1"
    assert result["net_sales"] == 0
    assert metrics_service.DATA_DELAY_NOTICE in result["data_delay_notice"]


def test_metrics_daily_casts(monkeypatch):
    dummy_rows = [
        {"metric_date": "2024-01-01", "gross_sales": "100.00", "net_sales": "90.00", "cost_of_goods": "40.00", "settlement_delay_count": "2"}
    ]
    dummy = DummySupabase(rpc_data=[{"business_id": "biz-1", "net_sales": 100}])
    dummy._table_data = dummy_rows
    monkeypatch.setattr(metrics_service, "supabase", dummy)
    data = metrics_service.list_metrics_daily("biz-1")
    assert isinstance(data["items"][0]["gross_sales"], float)
    assert data["items"][0]["settlement_delay_count"] == 2

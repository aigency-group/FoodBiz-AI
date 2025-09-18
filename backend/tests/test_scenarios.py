from types import SimpleNamespace

from services import reviews_service, policy_service


class DummyTable:
    def __init__(self, data):
        self._data = data

    # Support the fluent interface used in services.
    def select(self, *_args, **_kwargs):
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def order(self, *_args, **_kwargs):
        return self

    def limit(self, *_args, **_kwargs):
        return self

    def single(self):
        return self

    def execute(self):
        return SimpleNamespace(data=self._data)


class DummySupabase:
    def __init__(self, table_map):
        self._table_map = table_map

    def table(self, name):
        return DummyTable(self._table_map.get(name, []))


def test_get_review_summary_returns_defaults(monkeypatch):
    dummy = DummySupabase({"review_summary": None})
    monkeypatch.setattr(reviews_service, "supabase", dummy)

    summary = reviews_service.get_review_summary("biz-1")
    assert summary["business_id"] == "biz-1"
    assert summary["review_count"] == 0
    assert summary["average_rating"] == 0.0


def test_review_source_breakdown_handles_missing_sources(monkeypatch):
    dummy_reviews = [{"source": None}, {"source": "배달앱"}, {"source": "배달앱"}]
    dummy = DummySupabase({"reviews": dummy_reviews})
    monkeypatch.setattr(reviews_service, "supabase", dummy)

    sources = reviews_service.review_source_breakdown("biz-1")
    totals = {entry["source"]: entry["count"] for entry in sources}
    assert totals["배달앱"] == 2
    assert totals["기타"] == 1


def test_policy_workflows_assigns_status_color(monkeypatch):
    dummy_workflows = [
        {
            "policy_id": "pol-1",
            "status": "승인",
            "notes": "ok",
            "updated_at": "2024-01-01",
            "policy_products": {"name": "상품A"},
        }
    ]
    dummy = DummySupabase({"policy_applications": dummy_workflows})
    monkeypatch.setattr(policy_service, "supabase", dummy)

    workflows = policy_service.list_policy_workflows("biz-1")
    assert workflows[0]["status_color"] == policy_service.STATUS_COLORS["승인"]

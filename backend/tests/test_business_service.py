from types import SimpleNamespace

from services import business_service


class StubTable:
    def __init__(self, upsert_data, select_data):
        self.upsert_data = upsert_data
        self.select_data = select_data
        self.last_upsert_payload = None
        self.last_update_payload = None
        self.eq_filters = []
        self._current_operation = None
        self.update_called = False

    def upsert(self, payload, **_kwargs):
        self._current_operation = "upsert"
        self.last_upsert_payload = payload
        return self

    def select(self, *_args, **_kwargs):
        self._current_operation = "select"
        return self

    def eq(self, field, value):
        self.eq_filters.append((field, value))
        return self

    def single(self):
        return self

    def update(self, payload):
        self._current_operation = "update"
        self.last_update_payload = payload
        return self

    def execute(self):
        if self._current_operation == "upsert":
            return SimpleNamespace(data=self.upsert_data)
        if self._current_operation == "select":
            return SimpleNamespace(data=self.select_data)
        if self._current_operation == "update":
            self.update_called = True
            return SimpleNamespace(data=None)
        return SimpleNamespace(data=None)


class StubSupabase:
    def __init__(self, table):
        self._table = table

    def table(self, name):
        assert name == "businesses"
        return self._table


def test_upsert_business_uses_upsert_result(monkeypatch):
    table = StubTable(
        upsert_data=[{"id": "biz-1", "business_code": "CODE-1"}],
        select_data=None,
    )
    monkeypatch.setattr(business_service, "supabase", StubSupabase(table))

    result = business_service.upsert_business(
        owner_id="owner-1",
        store_name="테스트 상점",
        business_code="CODE-1",
        industry="카페",
    )

    assert result["id"] == "biz-1"
    assert table.last_upsert_payload["name"] == "테스트 상점"
    assert table.update_called is True
    assert ("id", "biz-1") in table.eq_filters
    assert table.last_update_payload == {"owner_id": "owner-1"}


def test_upsert_business_falls_back_to_select(monkeypatch):
    table = StubTable(
        upsert_data=[],
        select_data={"id": "biz-2", "business_code": "CODE-2"},
    )
    monkeypatch.setattr(business_service, "supabase", StubSupabase(table))

    result = business_service.upsert_business(
        owner_id="owner-2",
        store_name="다른 상점",
        business_code="CODE-2",
        industry=None,
    )

    assert result["id"] == "biz-2"
    assert table.last_upsert_payload["business_code"] == "CODE-2"
    assert table.update_called is True
    assert ("id", "biz-2") in table.eq_filters

import os
from typing import Any, Optional

try:
    from supabase import create_client, Client  # type: ignore
except ModuleNotFoundError:  # pragma: no cover - local test fallback
    create_client = None

    class Client:  # minimal interface for type checking
        def __getattr__(self, _name: str) -> Any:
            raise RuntimeError("Supabase client is not available in this environment.")

try:
    from dotenv import load_dotenv
except ModuleNotFoundError:  # pragma: no cover
    def load_dotenv():  # type: ignore
        return None

load_dotenv()

url: Optional[str] = os.environ.get("SUPABASE_URL")
key: Optional[str] = os.environ.get("SUPABASE_KEY")


class _NoopSupabase(Client):
    """Graceful fallback when Supabase SDK is unavailable."""

    def __init__(self):
        self.data = []

    def table(self, _name: str) -> "_NoopSupabase":
        return self

    def select(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def eq(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def order(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def limit(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def single(self) -> "_NoopSupabase":
        return self

    def insert(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def update(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def upsert(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def delete(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def contains(self, *_args: Any, **_kwargs: Any) -> "_NoopSupabase":
        return self

    def execute(self) -> Any:
        return type("Response", (), {"data": self.data})

    def rpc(self, *_args: Any, **_kwargs: Any) -> Any:
        return type("Response", (), {"data": []})

    class storage:  # type: ignore
        @staticmethod
        def from_(_bucket: str) -> "_NoopSupabase.storage":
            return _NoopSupabase.storage()

        def upload(self, **_kwargs: Any) -> None:
            return None

        def get_public_url(self, _path: str) -> str:
            return ""


if create_client and url and key:
    supabase: Client = create_client(url, key)
else:  # pragma: no cover - used in local test environments
    supabase = _NoopSupabase()

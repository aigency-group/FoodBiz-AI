"""Utility script to seed Supabase auth + business data for the PoC."""
from __future__ import annotations

import os
from typing import List, Dict

from supabase import Client

from .supabase_client import supabase

USERS: List[Dict[str, str]] = [
    {
        "email": "red-owner@example.com",
        "password": os.environ.get("PSEUDO_USER_PASSWORD", "Passw0rd!"),
        "business_id": "11111111-1111-1111-1111-111111111111",
        "business_name": "딴딴 본점",
    },
    {
        "email": "yellow-owner@example.com",
        "password": os.environ.get("PSEUDO_USER_PASSWORD", "Passw0rd!"),
        "business_id": "22222222-2222-2222-2222-222222222222",
        "business_name": "역전할머님맥주 보정점",
    },
    {
        "email": "jin1ib@naver.com",
        "password": os.environ.get("PSEUDO_USER_PASSWORD", "Passw0rd!"),
        "business_id": "33333333-3333-3333-3333-333333333333",
        "business_name": "제육대가 수지점",
    },
]


def ensure_user(client: Client, email: str, password: str) -> str:
    # Try to fetch existing user via admin API
    existing = client.auth.admin.list_users(email=email)
    for user in existing.get("users", []):
        if user.get("email") == email:
            return user["id"]

    created = client.auth.admin.create_user({"email": email, "password": password, "email_confirm": True})
    return created.user.id  # type: ignore[attr-defined]


def attach_profile(client: Client, user_id: str, business_id: str, business_name: str) -> None:
    # Link profile to business record
    client.table("profiles").upsert(
        {
            "id": user_id,
            "full_name": business_name,
            "business_id": business_id,
        }
    ).execute()

    client.table("businesses").update({"owner_id": user_id}).eq("id", business_id).execute()


def run():
    for user in USERS:
        uid = ensure_user(supabase, user["email"], user["password"])
        attach_profile(supabase, uid, user["business_id"], user["business_name"])
        print(f"Seeded user {user['email']} with business {user['business_name']}")


if __name__ == "__main__":
    run()

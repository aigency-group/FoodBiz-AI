# Phase 8 Implementation Plan (Auth-First & Data Automation)

## 1. Auth & Onboarding
- **Frontend**
  - Ensure `LoginScreen` is the only entry point when `currentUser` is undefined (already enforced in `App.tsx`, verify redirection from deep links).
  - Implement `SignupScreen` (new) with form validation: email, password, confirm password, optional business name.
  - Provide error banners for Supabase auth responses (duplicate email, weak password) and loading states.
  - After signup, prompt user to register/connect their business; route to a new `BusinessSetupScreen`.
- **Backend**
  - Create Supabase SQL migration:
    ```sql
    create table public.businesses (
      id uuid primary key default uuid_generate_v4(),
      owner_id uuid references auth.users(id) on delete cascade,
      name text not null,
      business_code text unique not null,
      created_at timestamp default now()
    );
    ```
  - Extend `profiles` table with `business_id uuid references public.businesses(id)`.
  - Write provisioning script in `backend/services` to seed 3 users + 3 businesses (one-to-one).
- **QA**
  - Scenarios: new signup, invalid password, duplicate email, logout/login loop, unauthorized route guard.

## 2. Dashboard Data Pipeline
- **Supabase Tables**
  - `metrics_daily` (date, business_id, gross_sales, net_sales, cost, tax_amount, settlement_delay_count, source). Index on (business_id, date desc).
  - `metrics_summary` materialized view for latest 30-day aggregates.
- **Backend Tasks**
  - Cron job (FastAPI + Celery or Supabase Edge Function) that fetches 국세청 홈택스 sales data nightly.
  - Store API fetch status in `data_jobs` table to surface errors.
  - API endpoint `/metrics/{business_id}/summary` returning latest data + `data_delay_notice` string ("최대 2일 지연될 수 있어요").
- **Frontend Updates**
  - Dashboard screen fetches summary via hook `useMetrics(businessId)`; show skeleton + `Badge` warning when `data_delay_notice` present.
  - Replace hardcoded chart values with response from Supabase RPC or REST endpoint.

## 3. Review & Policy Modules
- **Reviews**
  - Migrate Excel ingestion pipeline to Supabase `reviews` table: fields (id, business_id, rating, content, source, created_at).
  - Update frontend components to query via `/reviews/summary?business_id=...`, remove static JSON.
  - Sync job to refresh sentiment aggregates daily.
- **Policy**
  - Tables: `policy_products`, `policy_recommendations`, `policy_applications` with workflow status.
  - Backend endpoint `/policy/recommendations?business_id=` returning grouped data.
  - Frontend uses response to populate cards; maintain color tokens for status.

## 4. AI/RAG Updates
- Extend embedding pipeline to index metrics highlights per business (top anomalies) + policy recommendation notes.
- On chat request, load data for logged-in business id; fallback prompt already implemented.
- Add evaluation notebook to track RAG fallback usage frequency.

## 5. Data Delay Messaging
- Shared constant `DATA_DELAY_NOTICE = "국세청 홈택스 연동으로 1~2일 지연될 수 있어요."`.
- Display in:
  - Dashboard header (tooltip/badge)
  - Metrics detail screen (help text)
  - API response metadata.

## 6. Testing & Monitoring
- Unit tests for auth service wrappers and data retrieval endpoints.
- Integration tests (Postman or pytest) covering login -> dashboard fetch -> review summary.
- Logging: capture cron job status, auth errors, Supabase sync failures (structured JSON).
- Alerting: set up Supabase Functions/Edge logs to trigger alerts when data job fails twice consecutively.

## 7. Deliverables
- Updated docs (`role_card.txt`, `query.txt`) ✅
- Supabase SQL migration + seed script (TBD)
- Frontend auth screens + guards (TBD)
- Backend data ingestion + APIs (TBD)
- QA checklist & monitoring dashboard (TBD)

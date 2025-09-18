# Release Plan: AI Financial Service Web App

This document outlines the 7-phase development plan.

## PHASE 1) Foundation & Bootstrap
- **Goal:** Establish the development environment, repository, and security foundation.
- **Tasks:**
  - Initialize Git/GitHub, branch rules.
  - Deploy `.gitignore`, `.env.example`.
  - Scaffold frontend (Vite) and backend (FastAPI).
  - Create Supabase project, initial bucket/table drafts.
  - Implement basic health check (`/health`) and CORS.
- **Deliverables:**
  - `environment.md` (Key list, injection paths, warnings)
  - `repo-structure.md`
  - `supabase-schema-draft.sql`

## PHASE 2) Core API & Data Contracts
- **Goal:** Stabilize API contracts, define common DTOs/schemas.
- **Tasks:**
  - Implement Auth (JWT), user/integration resource schemas.
  - Define RAG draft endpoint contract (`/rag/query` schema).
  - Automate OpenAPI documentation (`/docs`).
- **Deliverables:**
  - `api-spec.md` (Request/Response/Error codes)
  - `auth-flow.md`

## PHASE 3) RAG Pipeline v1
- **Goal:** Achieve initial functionality of document ingestion, embedding, and search/response.
- **Tasks:**
  - Build `RAGService`: Ingestor (documents to chunks), embeddings, Chroma/FAISS.
  - Create prompt template v1 (for policy/management guides).
  - Finalize response schema with sources/snippets.
- **Deliverables:**
  - `rag-design.md`, `prompt-v1.md`
  - `indexing-log.json`

## PHASE 4) Realtime Chat & Alerts
- **Goal:** Implement WebSocket chatbot and in-app event notifications.
- **Tasks:**
  - `WebSocket`: ConnectionManager, streaming.
  - Design in-app notification center (polling or SSE).
  - Implement error/backoff/retry strategies.
- **Deliverables:**
  - `chat-flow.md` (Sequence/error flows)
  - `alert-spec.md`

## PHASE 5) Dashboard & Signal Index
- **Goal:** Develop signal indicators (green/orange/red) and a KPI dashboard.
- **Tasks:**
  - Create KPI cards (sales/costs/profits), industry average comparison.
  - Design signal calculation rules (hybrid: rule-based + LLM).
  - Implement graphs, detail modals, and settlement delay warnings.
- **Deliverables:**
  - `signal-spec.md` (Thresholds, color rules)
  - `dashboard-ux.md`

## PHASE 6) Hardening & QA
- **Goal:** Enhance security, performance, accessibility, and testing.
- **Tasks:**
  - Implement logging (with PII removal), error handlers, rate limiting.
  - Conduct E2E, integration, and unit tests (10+ scenarios).
  - Adhere to bundle size and TTFB limits.
- **Deliverables:**
  - `qa-report.md`, `perf-report.md`
  - `risk-register.md`

## PHASE 7) Demo & Release Notes
- **Goal:** Prepare demo scripts, release notes, and conduct rehearsals.
- **Tasks:**
  - Create demo presets (dummy/real data), failure flip tests.
  - Finalize `README.md`, release notes, and operations checklist.
- **Deliverables:**
  - `demo-script.md`, `release-notes.md`
  - `ops-checklist.md`

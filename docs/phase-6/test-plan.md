# Test Plan v1

- **Author:** QA Engineer
- **Status:** Draft

This document outlines the strategy for smoke and regression testing to ensure application stability.

---

## 1. Smoke Testing

**Objective:** To verify that the most critical functionalities of the application are working after a new build is deployed. This is a quick, high-level test to catch major issues early.

**Trigger:** Automatically run after every successful deployment to a testing or staging environment.

**Scope:**
- **[ ] 1. Health Check:** The backend `/health` endpoint returns a `200 OK` status.
- **[ ] 2. User Signup & Login:** A new user can sign up, and an existing user can log in.
- **[ ] 3. Dashboard Loading:** The main dashboard loads with its widgets and (mock) data without crashing.
- **[ ] 4. Chatbot Connection:** The WebSocket chat widget connects successfully.
- **[ ] 5. SSE Connection:** The SSE alert service connects successfully.

**Passing Criteria:** All smoke tests must pass. A single failure is a critical issue and should block further testing or deployment.

## 2. Regression Testing

**Objective:** To ensure that new code changes have not adversely affected existing features. This is a more comprehensive test suite that covers a wider range of scenarios.

**Trigger:** Run before a planned release to production or on a nightly basis in a dedicated QA environment.

**Scope:**
- **Full execution of all QA Scenarios** defined in `docs/phase-6/qa-scenarios.md`.
- **Automated E2E Tests (Future):** An automated test suite (e.g., using Playwright or Cypress) will eventually cover the core user flows.
- **Manual Testing:**
  - **[ ] 2.1. Cross-Browser Testing:** Manually verify UI and functionality on the latest versions of Chrome, Firefox, and Safari.
  - **[ ] 2.2. Mobile-Specific Testing:**
    - Verify layout and usability on a representative iOS device (e.g., iPhone 13).
    - Check for mobile-specific issues like keyboard handling, touch targets, and safe area layout (`[ ] iOS 입력/키보드 safe-area 대응` task).
  - **[ ] 2.3. Performance Baseline:** Manually check key performance metrics against the `quality-checklist.md` to spot significant regressions.

**Passing Criteria:** All critical and major-severity test cases must pass. A small number of minor-severity bugs may be acceptable for a release, as documented in the `risk-register.md`.

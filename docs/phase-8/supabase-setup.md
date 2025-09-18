# Supabase Project Access & Migration Guide

## 1. Accessing the Supabase Project
1. **Log in** to [https://app.supabase.com](https://app.supabase.com) with the project owner account.
2. Open the project dashboard and verify you can see the project sidebar (Table editor, SQL editor, Authentication, Storage, etc.).
3. In the **Project Settings → API** section copy the following keys for local development:
   - `Project URL`
   - `anon` public API key (for frontend)
   - `service_role` secret (for backend scripts / migrations)
4. Under **Access Control**, ensure your account has the "Owner" or "Full Access" workspace role so you can run SQL statements and manage Edge Functions.

## 2. SQL Migration Execution
1. Go to **SQL Editor** in the Supabase dashboard.
2. Create a new query and paste the migration script (`docs/phase-8/supabase-migration.sql`).
3. Run the script once; verify creation of tables by checking the Table editor.
4. Optionally, save the script as a migration to the Supabase project history for traceability.
5. If you prefer CLI:
   ```bash
   npx supabase login        # enter access token from https://app.supabase.com/account/tokens
   npx supabase link --project-ref <project-ref>
   npx supabase db push      # applies SQL from supabase/migrations
   ```
6. Confirm the new schemas appear under `public` and the functions (`metrics_latest_summary`, etc.) exist.

## 3. Seed Data Loading
1. After migrations, run the seed script via SQL editor using the contents of `docs/phase-8/supabase-seed.sql`.
2. Verify three users (red/yellow/green) exist in `auth.users` and related entries appear in `profiles`, `businesses`, `metrics_daily`, and `reviews`.
3. Update passwords/reset links via Supabase Auth UI if necessary.

Optional: 향후 홈택스 연동을 추가할 계획이라면 Edge Function을 이 시점 이후에 구성하세요. PoC 단계에서는 스키마만 참고하면 됩니다.

Once the above is complete you can run the backend provisioning command to sync local caches:
```bash
cd backend
python -m services.seed_supabase
```

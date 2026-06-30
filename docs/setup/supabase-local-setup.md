# Supabase local setup

Copy `.env.example` to `.env.local` and fill in values from the Supabase project settings. Never commit `.env.local`, credentials, access tokens, database passwords, or copied JWTs.

| Variable | Exposure | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public browser configuration | Browser/server Supabase clients, authentication, onboarding, repository configuration checks, and smoke runner |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public browser configuration | Browser/server Supabase clients under Row Level Security and the smoke runner configuration check |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only secret | `scripts/smoke-galley-supabase.mjs` only, for a headless administrative smoke identity |

The `NEXT_PUBLIC_*` values are intentionally available in browser bundles. They do not bypass RLS. The service-role key bypasses RLS and must never be imported into application UI code, prefixed with `NEXT_PUBLIC_`, logged, or deployed to an untrusted client.

Apply migrations in filename order before testing. Then run:

```bash
npm run smoke:galley:supabase
```

The runner reads `.env.local` when present. It creates or reuses records marked `GALLEY_SMOKE_V1`; it does not delete unrelated or production-like data. Browser testing still uses an authenticated user and the anon key so tenant RLS is exercised normally.

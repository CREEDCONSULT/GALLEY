# Galley — Tools & Third-Party APIs

Every external service Galley depends on or will depend on, by phase. Costs are list prices as of
mid-2026; re-verify before contracting. Decision rule: **no external service may own a domain
invariant** (publish gate, append-only record, claims rules) — those live in our code and database.

## Phase 1 — today

| Service | Purpose | Plan / cost | Notes |
|---|---|---|---|
| **Supabase** | Auth, Postgres, RLS, storage | Free → Pro $25/mo/project | Append-only `events` + all domain tables |
| **Railway** | Hosting (project `GALLEY`, service `galley-web` from GitHub main) | Hobby $5/mo incl. usage → Pro $20/seat/mo | Next.js auto-detected; PR deploys available |
| **GitHub** | Repo `CREEDCONSULT/GALLEY`, CI via Actions | Free | CI: typecheck, lint, build, validate scripts |
| **PostHog** | Product analytics, funnels (activation metrics in PRD §7) | Free tier generous | Project already provisioned (US cloud) |

## Phase 2 — verification engine + multi-user

| Service | Purpose | Est. cost | Notes |
|---|---|---|---|
| **Anthropic Claude API** | LLM-graded checks (voice adherence, claim-paraphrase detection); later drafting | Usage-based; Haiku for cheap checks, Sonnet for judgment calls | Rubric + model version stamped on every verification run |
| **Voyage AI or OpenAI embeddings** | Paraphrase similarity vs. forbidden claims (pgvector) | ~$0.02–0.13 / M tokens | Decide via Phase 2 eval harness vs. LLM-judge |
| **Sentry** | Error monitoring | Team ~$26/mo | Client + server + edge |
| **Resend** | Transactional email (proof notifications, invites) | Free → $20/mo | React Email templates |
| **Inngest or Trigger.dev** | Durable background verification jobs (if Supabase queues/cron insufficient) | Free tier → ~$20–50/mo | Adopt only when request-scope runs hit limits |

## Phase 3 — supervised production

| Service | Purpose | Est. cost |
|---|---|---|
| **Claude API (generation)** | Brief → draft inside the governed loop | ~$0.05–0.30/article-length draft (Sonnet); metered per tenant |
| **Stripe** | Subscriptions, per-workspace metering, customer portal | 2.9% + 30¢ |
| **Cloudflare Turnstile** | Signup abuse protection | Free |

## Phase 4 — schedule & publish

| Service | Purpose | Notes |
|---|---|---|
| **WordPress REST API** | First publish target (Application Passwords) | Free; per-site credentials stored encrypted |
| **Webflow API / Shopify Admin API** | CMS publish targets #2–3 | OAuth apps |
| **LinkedIn API + X API** (direct) or **Ayrshare** (aggregator, ~$49–149/mo) | Social publishing | Decide on volume; X API paid tiers are volatile — prefer aggregator early |
| **Slack API** | `awaiting_proof` notifications, approve-from-Slack later | Free |
| **Google Calendar-style ICS export** | Client-facing schedules | In-app, no vendor |

## Phase 5 — reporting & audit

| Service | Purpose |
|---|---|
| **GA4 Data API** | Traffic/conversion KPIs mapped to playbook `reporting_kpi` |
| **Google Search Console API** | Search performance for published URLs |
| **Meta / LinkedIn / X insights APIs** | Social KPIs |
| **PDF generation (react-pdf or Playwright print, in-house)** | Signed audit exports with payload hashes |

## Internal tooling

| Tool | Purpose |
|---|---|
| GitHub Actions | CI: `tsc --noEmit`, `eslint`, `next build`, `validate:galley*`; later Vitest + Playwright + RLS tests |
| Supabase CLI | Local dev DB, migrations, `gen types typescript` |
| Figma | Design source of truth (tokens mirrored from DESIGN.md) |

## Explicitly retired (legacy ContentFlow AI stack — do not re-adopt without a decision record)

- n8n (workflow engine) — loop lives in app code
- DataForSEO / keyword APIs — SEO-tool positioning retired
- Buffer as primary social layer — superseded by aggregator-vs-direct decision in Phase 4
- SendGrid — Resend covers transactional; marketing email TBD
- LogSnag — PostHog covers events

## Cost envelope (pre-revenue → early revenue)

- Phase 1–2 fixed: ≈ $80–130/mo (Supabase Pro, Railway, Sentry, Resend) + LLM usage
- LLM verification COGS target: < $0.05 per verification run average (Haiku-first routing)
- Gross margin guard: keep total AI COGS < 15% of MRR (SaaS median gross margin is ~77%
  [Benchmarkit 2025]; AI inference pressures this — see BUSINESS_PLAN.md §7)

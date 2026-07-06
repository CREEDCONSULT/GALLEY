# Galley — Tech Stack

**Principle:** one boring, vertically-integrated stack (Next.js + Supabase + Railway) until a
workload proves it needs a dedicated service. Every addition below is tied to the phase that
justifies it. Third-party services and pricing live in [TOOLS_AND_APIS.md](TOOLS_AND_APIS.md).

## Current (Phase 1 — validation node, in repo today)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript 5 | Server Components + Server Actions for all mutations |
| Styling | Tailwind CSS v4 | Semantic tokens in `app/globals.css`; system in [DESIGN.md](DESIGN.md) |
| Motion / icons | Framer Motion · Lucide React | Sparing use per design principles |
| Auth | Supabase Auth (`@supabase/ssr`) | Cookie-based SSR sessions; middleware refresh |
| Database | Supabase Postgres | RLS everywhere; append-only `events` via trigger; forward-only migrations |
| Data access | `lib/galley/repository.ts` (`server-only`) | No client-side table access |
| Validation scripts | `scripts/validate-galley-*.mjs`, `smoke-galley-supabase.mjs` | Current safety net |
| Hosting | Railway (project `GALLEY`, service `galley-web`, deploys from GitHub `main`) | PR environments available via Railway PR deploys |

## Phase 2 additions — real verification + multi-user

| Need | Choice | Rationale |
|---|---|---|
| Schema validation | **Zod** (+ React Hook Form for playbook forms) | Shared input validation for Server Actions and API routes |
| LLM access | **Anthropic Claude API** (primary) via official SDK | LLM-graded voice/claims checks; rubric versioned per run |
| Deterministic checks | In-repo TypeScript rules engine | Explainability requires owning the rule code; no black-box vendor |
| Background jobs | **Supabase Edge Functions + pg_cron / Supabase Queues** first; **Inngest or Trigger.dev** when verification runs exceed request timeouts | Durable, retryable verification runs |
| Testing | **Vitest** + Testing Library; **Playwright** for proof-queue E2E; pgTAP or script-based RLS tests | The append-only and approval invariants get dedicated tests |
| Types | `supabase gen types typescript` into `types/supabase.ts` | Kill hand-drift between SQL and TS |
| Errors/monitoring | Sentry | Client + server |

## Phase 3 additions — supervised production

| Need | Choice |
|---|---|
| Generation | Claude (Sonnet default / Haiku for cheap ops) with prompt+model version stamped on each draft |
| Editor | TipTap (ProseMirror) with version snapshots; diffs via `diff-match-patch` |
| Embeddings for paraphrase detection | pgvector on Supabase + Voyage or OpenAI embeddings — evaluated against LLM-judge in the Phase 2 eval harness |
| Cost metering | Per-tenant token accounting table + plan quotas |

## Phase 4 additions — schedule/publish

| Need | Choice |
|---|---|
| Scheduling | Postgres + pg_cron (or Inngest schedules); calendar UI in-app |
| Publishing | WordPress REST (Application Passwords) first; then Webflow API, Shopify Admin API; social via **Ayrshare or direct LinkedIn/X APIs** (decide on volume) |
| Notifications | **Resend** (transactional email); Slack webhook integration |
| Billing | **Stripe** (subscriptions + seat/workspace metering) |

## Phase 5 additions — reporting

| Need | Choice |
|---|---|
| KPI ingestion | GA4 Data API, Google Search Console API, platform insights APIs |
| Report/audit exports | Server-rendered PDF (react-pdf or Playwright print) with payload hashes |
| Product analytics | PostHog (already provisioned) |

## Explicitly not in the stack

- **n8n / external workflow engines** — the governed loop is core IP; it stays in application code
  where invariants are testable. (Legacy ContentFlow docs reference n8n; retired.)
- **Prisma/other ORM** — Supabase client + typed repository is sufficient; revisit only if query
  complexity forces it.
- **Microservices** — modular monolith until verification or publishing load proves otherwise.
- **DataForSEO / keyword tooling** — retired with the SEO-tool positioning.

# Galley — Project Guide

Galley is a **supervised content-operations agent** for marketing agencies and DTC brand teams.
Tagline: **"Proof before press."** AI produces and verifies content against a client playbook;
a human always makes the publish decision; every decision lands in an append-only record.

The governed loop: **Produce → Verify → Proof → Schedule → Report.**

## Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type check**: `npx tsc --noEmit`
- **Domain invariant check (mock)**: `npm run validate:galley`
- **Verifier rules contract**: `npm run validate:galley:verifier`
- **Convex live smoke test**: `npm run smoke:galley:convex` (full loop + human-gate + auth invariants against the dev deployment)
- **Convex deploy (dev)**: `npx convex dev --once` (uses `CONVEX_DEPLOY_KEY` from `.env.local`)

There is no unit-test runner installed yet; the `validate:*` scripts are the current safety net.
Run typecheck + build + `validate:galley` before claiming work complete.

## Stack (actually installed — check package.json before assuming)

- **Framework**: Next.js 16 (App Router, Server Actions), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `app/globals.css`), `clsx` + `tailwind-merge`
- **Motion**: Framer Motion; **Icons**: Lucide React
- **Backend**: **Convex** (dev deployment `polished-crow-784`, team `dante-creed`, project
  `galley`). Domain schema + functions in `convex/`; invariants enforced in mutation code since
  Convex has no DB triggers — mutations must remain the only write path, and nothing may
  patch/delete `events`.
- **Auth**: **Convex Auth** (`@convex-dev/auth`, Password provider). `convex/auth.ts` +
  `convex/http.ts`; JWT keys + `SITE_URL` set as Convex env vars. Next.js wired via
  `ConvexAuthNextjsServerProvider` (layout), `convexAuthNextjsMiddleware` (`middleware.ts`).
  Proof decisions require an authenticated actor (`requireReviewer`) and attribute to the real user.
- **Hosting**: Railway (`galley-web`). Supabase was fully removed — do not reintroduce it.
- NOT installed (do not import): shadcn/ui, Radix, react-hook-form, zod, n8n SDKs, LangChain

## Architecture map

- `app/` — routes: `/` (landing), `/login`, `/onboarding` (playbook setup), `/dashboard`
  (validation-node overview), `/dashboard/proof` (proof queue), `/dashboard/records` (audit record)
- `lib/galley/types.ts` — canonical domain types (Tenant, ClientAccount, Playbook, Deliverable,
  Draft, Verification, Approval, Event)
- `lib/galley/invariants.ts` — domain invariants (approval-before-scheduling)
- `lib/galley/verifier.ts` — deterministic verification rules engine (pure; shared by app,
  Convex functions, and validation scripts; rubric-versioned)
- `lib/galley/convexData.ts` — server-only Convex facade (maps Convex docs to canonical types;
  `authedClient()` attaches the signed-in user's token for authenticated mutations)
- `lib/galley/mockValidationNode.ts` — deterministic mock state for the demo seed
- `convex/` — schema, domain functions (`galley.ts`), auth (`auth.ts`, `http.ts`, `auth.config.ts`)
- `supabase/migrations/` — historical Postgres schema (reference only; Supabase was removed)
- `components/galley/` — proof-queue UI components; `components/ConvexClientProvider.tsx` — auth provider

## Domain invariants (never violate)

1. **Humans are the publish gate.** No deliverable reaches `scheduled` or `published` without a
   recorded human `approve` action (`assertApprovalBeforeScheduling`).
2. **The event log is append-only.** Corrections are new events. On Convex there is no trigger —
   mutations are the only write path and none may patch/delete an `events` row. Never weaken this.
3. **Drafts and verifications are immutable versions.** New content = new version row.
4. **Tenant isolation.** Every domain row carries `tenant_id`; all access is authorized by
   workspace + client account. RLS stays enabled.
5. **Claims are explicit rules.** Approved/forbidden claims live in the playbook; never infer
   approval from generated text.
6. **No confidence theater.** Status language describes observable state; verifier notes state
   evidence. No unsupported performance claims in UI copy.

## Deliverable state machine

`drafting → verifying → awaiting_proof → approved → scheduled → published`,
with `rejected` and `escalated` branches. "Approved" means cleared for scheduling — not published.

## Conventions

- Functional components, PascalCase component names, kebab-case file/dir names (except Next.js
  standards like `layout.tsx`).
- Server Actions for mutations; repository functions are `server-only`.
- Use semantic Tailwind tokens from `app/globals.css`; follow [DESIGN.md](DESIGN.md).
- Migrations are forward-only; never edit an applied migration.

## Key documents

- [PLAN.md](PLAN.md) — master plan and document index
- [BUSINESS_PLAN.md](BUSINESS_PLAN.md) — market, pricing, GTM, financials
- [docs/product/galley-prd.md](docs/product/galley-prd.md) — product requirements
- [docs/architecture/galley-technical-design.md](docs/architecture/galley-technical-design.md) — technical design
- [DESIGN.md](DESIGN.md) — design system and UX rules
- [TECH-STACK.md](TECH-STACK.md) — stack decisions; [TOOLS_AND_APIS.md](TOOLS_AND_APIS.md) — third-party services
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — phased roadmap
- `docs/legacy/` — pre-pivot ContentFlow AI documents (historical context only; do not treat as
  current requirements)

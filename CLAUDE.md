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
- **Persistence invariant check**: `npm run validate:galley:persistence`
- **Supabase live smoke test**: `npm run smoke:galley:supabase` (requires `.env.local` with Supabase keys)

There is no unit-test runner installed yet; the `validate:*` scripts are the current safety net.
Run typecheck + build + `validate:galley` before claiming work complete.

## Stack (actually installed — check package.json before assuming)

- **Framework**: Next.js 16 (App Router, Server Actions), React 19, TypeScript 5
- **Styling**: Tailwind CSS v4 (`@theme` tokens in `app/globals.css`), `clsx` + `tailwind-merge`
- **Motion**: Framer Motion; **Icons**: Lucide React
- **Backend**: Supabase (Auth via `@supabase/ssr`, Postgres, RLS)
- NOT installed (do not import): shadcn/ui, Radix, react-hook-form, zod, n8n SDKs, LangChain

## Architecture map

- `app/` — routes: `/` (landing), `/login`, `/onboarding` (playbook setup), `/dashboard`
  (validation-node overview), `/dashboard/proof` (proof queue), `/dashboard/records` (audit record)
- `lib/galley/types.ts` — canonical domain types (Tenant, ClientAccount, Playbook, Deliverable,
  Draft, Verification, Approval, Event)
- `lib/galley/invariants.ts` — domain invariants (approval-before-scheduling)
- `lib/galley/repository.ts` — server-only Supabase data access
- `lib/galley/mockValidationNode.ts` — deterministic mock state for the V1 prototype
- `utils/supabase/{client,server,middleware}.ts` — Supabase client factories
- `supabase/migrations/` — schema; `20260629_galley_validation_node.sql` is the core domain schema
- `components/galley/` — proof-queue UI components

## Domain invariants (never violate)

1. **Humans are the publish gate.** No deliverable reaches `scheduled` or `published` without a
   recorded human `approve` action (`assertApprovalBeforeScheduling`).
2. **The event log is append-only.** Corrections are new events; UPDATE/DELETE on `events` is
   rejected by a DB trigger. Never weaken this.
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

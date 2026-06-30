# Galley Phase 2.5 — Supabase persistence

Phase 2.5 moves the validation node from browser-local state to a tenant-scoped Supabase repository. It does not add production generation, scheduling, publishing, or reporting.

## What is persisted

- Tenant and client accounts
- Versioned client playbooks
- Deliverables and versioned drafts
- Verifier results and reasons
- Human approve, edit, and reject decisions
- Append-only events used by the Records screen

The event log is the chain-of-custody source of truth. Database triggers reject event updates and deletes. Resetting demo work appends reset evidence and removes generated work while preserving events.

## Repository and server boundary

`lib/galley/repository.ts` owns typed database reads and writes. Server actions in `app/dashboard/proof/actions.ts` compose those operations for demo seeding and proof decisions. Client components only submit an action and refresh server-rendered data.

The approval action checks that the current draft passed verification and is awaiting proof. The repository also enforces approval-before-scheduling/publishing as a server-side invariant. Approval records clearance for a future step; it never publishes content.

## Demo seed and reset

The Proof Queue includes clearly labelled local demo controls. Seed creates four client accounts—Glow Skincare, Northshore Fitness, Acme Corp, and Day One—one playbook per account, and two generated/verified deliverables per account. The operation is idempotent for the fixed `2026-06` demo period.

Reset is disabled in production. It removes generated validation work for the signed-in tenant but retains the append-only event history. Client accounts and playbooks remain available for another run.

## Supabase setup

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Apply `20260629_galley_validation_node.sql` and `20260630_galley_persistence_policies.sql` in order.
3. Sign in through Galley before using the dashboard. RLS scopes all data to the authenticated tenant owner.
4. Open `/dashboard/proof` and use **Seed demo**.

Without credentials, Galley renders a truthful setup state and the persistence validation runs in mock/schema mode.

## Validation

- `npm run validate:galley` exercises the existing mock validation loop and invariants.
- `npm run validate:galley:persistence` verifies repository exports, schema tables, RLS/append-only contracts, and retained mock mode.
- `npm run lint`
- `npm run build`

## Deliberate limitations

- Mutations are sequential server operations, not yet atomic database transactions/RPCs.
- Phase 2.5 uses a single authenticated owner per tenant; memberships and roles are deferred.
- Live persistence smoke testing requires a configured Supabase project and authenticated browser session.
- Generation and verification remain deterministic mocks. Scheduling and publishing are unavailable.

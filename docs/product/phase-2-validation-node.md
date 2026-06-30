# Phase 2: MVP Validation Node Foundation

## Outcome

Phase 2 makes the Galley validation loop functional with typed local state and deterministic mock services:

Client account → playbook → mock draft → mock verification → proof decision → append-only record

The implementation deliberately stops before scheduling, publishing, channel integrations, billing, or external AI generation.

## Current stack

- Next.js 16 App Router with TypeScript and React 19.
- Dashboard routes share a client-side validation provider under `app/dashboard/layout.tsx`.
- Supabase SSR utilities support authentication and profile onboarding.
- Supabase migrations already exist; Phase 2 adds a separate validation-node migration.
- Tailwind CSS v4 consumes the Galley design tokens from `app/globals.css`.

## Implemented foundation

### Persistent schema shape

`supabase/migrations/20260629_galley_validation_node.sql` defines:

- `tenants`
- `client_accounts`
- `playbooks`
- `deliverables`
- `drafts`
- `verifications`
- `approvals`
- `events`

The migration includes lifecycle checks, foreign keys, tenant/account/deliverable indexes, an `updated_at` trigger for deliverables, RLS enabled with a secure no-policy default, and an event mutation trigger that rejects updates and deletes.

The SQL is a migration artifact only in this phase. The UI does not write these tables yet.

### Typed domain

`lib/galley/types.ts` defines the eight entities plus:

- `DeliverableStatus`
- `ApprovalAction`
- `VerificationResult`
- `GalleyEventType`
- `MockValidationState`

Application code uses camelCase fields; the migration uses PostgreSQL snake_case fields.

### Mock validation service

`lib/galley/mockValidationNode.ts` provides pure functions for:

- client-account creation
- playbook creation
- deterministic mock deliverable and draft generation
- rules-based mock verification
- approval, edit, and reject transitions
- record timeline construction

The service contains realistic definitions for Glow Skincare, Northshore Fitness, Acme Corp, and Day One. It does not call an external model or network service.

Passed verification moves a deliverable to `awaiting_proof`. Failed verification moves it to `escalated`; failed work does not silently enter proof.

### Shared application state

`GalleyValidationProvider` scopes the mock state to the dashboard layout. Proof decisions update deliverables, approvals, drafts, and events together:

- Approve → status becomes `approved`; approval and `human.approved` event append.
- Edit → a new draft version is created; status becomes `verifying`; edit approval and `human.edited` event append.
- Reject → status becomes `rejected`; rejection approval and `human.rejected` event append.

State survives client-side navigation between dashboard, proof, and records. It resets on a full page reload because persistence is intentionally deferred.

## Event types

- `playbook.selected`
- `draft.generated`
- `verification.passed`
- `verification.failed`
- `deliverable.awaiting_proof`
- `human.approved`
- `human.edited`
- `human.rejected`
- `deliverable.scheduled` (reserved)
- `deliverable.published` (reserved)

Every event contains tenant and account scope, actor type and label, event type, subject reference, payload, and timestamp. The records route filters and orders this log to build a deliverable’s chain of custody.

## Approval invariant

`lib/galley/invariants.ts` implements the governing rule:

> A deliverable cannot become scheduled or published without at least one approval whose action is `approve`.

`canScheduleDeliverable()` reports whether the rule is satisfied. `assertApprovalBeforeScheduling()` throws when it is not.

Scheduling is not implemented; defining the invariant now prevents a future scheduling service from inventing a weaker rule.

## Validation

`npm run validate:galley` executes the actual TypeScript mock service using Node’s type stripping. It verifies:

- four accounts, playbooks, deliverables, and drafts are created
- mock verification returns known results
- approve, edit, and reject transitions produce the correct state and events
- edited drafts increment version and return to verification
- record timelines contain only the selected deliverable and preserve event order
- rejected or edited work cannot satisfy the scheduling invariant
- a scheduled sample is accepted only with a recorded approval

## Still mock or local

- Draft text is deterministic fixture content.
- Verification is a small forbidden-claim check plus fixture reasons.
- The reviewer identity is a mock UUID and label.
- Dashboard state is in memory and resets on reload.
- Onboarding profile persistence is not yet mapped into the new tenant/account/playbook tables.
- The migration has no tenant-membership policies or browser-facing data access.
- Records are not yet exported, signed, or hashed.

## Intentionally excluded

- OpenAI, Anthropic, or other model calls.
- Real scheduling or publishing.
- WordPress, email, social, or reporting integrations.
- A second workflow or workflow builder.
- Billing and usage metering.
- Production RLS membership policies.

## Recommended next phase

Build a server-side repository layer for the existing typed domain:

1. Add tenant memberships and strict tenant-scoped RLS policies.
2. Persist onboarding into `client_accounts` and versioned `playbooks`.
3. Implement one transaction per proof action that updates the deliverable and appends approval/event rows atomically.
4. Hydrate the current provider from server data while retaining the same UI contracts.
5. Add database tests proving events cannot be updated/deleted and scheduling cannot bypass approval.

External generation should remain deferred until persisted playbooks, verification evidence, and proof decisions are reliable.

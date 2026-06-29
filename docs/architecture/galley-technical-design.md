# Galley V1 Technical Design

## Goal

Provide a thin, credible foundation for Galley’s validation node using the existing Next.js application. This design deliberately separates the V1 prototype UI from future generation, scheduling, and reporting services.

## System boundary

```text
Client playbook
      ↓
Draft placeholder → Verifier placeholder → Human proof decision
                                           ↓
                                  Append-only record
                                           ↓
                             Schedule / report (future)
```

## Current implementation

- Next.js App Router and TypeScript render the landing, onboarding, dashboard, and proof queue.
- Tailwind CSS v4 consumes semantic tokens from `app/globals.css`.
- Supabase authentication and the existing profile table remain available.
- Proof queue records and actions use static client-side data in V1.
- Existing profile fields persist the compatible subset of playbook setup; full playbook persistence requires a follow-up migration.

## Proposed domain model

### `client_playbook`

Versioned configuration containing identity, audience, offer, channels, voice rules, approved and forbidden claims, competitor references, and reporting KPI. Editing creates a new version.

### `deliverable`

Stable identity for a piece of work. Contains client, type, channel, current version reference, and lifecycle state.

### `deliverable_version`

Immutable draft snapshot with body, author/source, created timestamp, and playbook version used.

### `verification_run`

Immutable result for one deliverable version. Contains outcome (`pass`, `warning`, `blocked`), rule findings, evidence, verifier version, and timestamp.

### `proof_decision`

An append-only human event: `approved`, `changes_requested`, or `rejected`, plus actor, note, and timestamp.

### `record_event`

Canonical event envelope with event ID, aggregate ID, type, actor, timestamp, payload hash, and payload. Corrections append a superseding event; prior events are never overwritten.

## State model

```text
Draft → Verifying → Needs proof → Approved
                    ↘ Changes requested → Draft
                    ↘ Rejected
```

“Approved” means cleared for a future scheduling step. It does not mean published.

## Route foundation

- `/` — positioning and governed-loop explanation.
- `/onboarding` — client playbook setup.
- `/dashboard` — validation-node overview, not an analytics dashboard.
- `/dashboard/proof` — proof queue prototype.

## Trust and security requirements

- Require an authenticated actor for persisted proof decisions.
- Authorize all records by workspace and client account.
- Store timestamps server-side and actor IDs from the authenticated session.
- Validate decision transitions on the server.
- Hash immutable payloads and keep audit events append-only at the database policy level.
- Keep approved/forbidden claims as explicit rules; do not infer approval from generated text.

## Future API seams

- `POST /draft-runs` creates a version from a playbook and brief.
- `POST /verification-runs` verifies one immutable version.
- `POST /proof-decisions` appends a human decision.
- `GET /records/:deliverableId` returns the ordered audit history.

These are seams, not V1 implementation commitments.

## Testing strategy

- Typecheck and production-build every route.
- Component tests for status labels and proof action transitions.
- Integration tests for playbook validation and authenticated record writes once persistence lands.
- Database tests proving record events cannot be updated or deleted by application roles.

## Deferred work

Real generation, verifier execution, publishing, scheduling, KPI ingestion, billing changes, and workflow authoring are intentionally deferred.


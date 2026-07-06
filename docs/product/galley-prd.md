# Galley — Product Requirements Document

**Status:** Living document · **Owner:** Dante Creed · **Last updated:** 2026-07-06
**Related:** [BUSINESS_PLAN.md](../../BUSINESS_PLAN.md) · [Technical design](../architecture/galley-technical-design.md) · [DESIGN.md](../../DESIGN.md) · [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md)

---

## 1. Product statement

Galley is the **supervised content-ops agent** for agencies and DTC teams. Its promise is simple:
**Proof before press.** Galley coordinates a governed loop — **produce, verify, proof, schedule,
report** — without removing the human owner from consequential decisions.

Galley is not another blank-page generator. It is the reliable operating layer between a client
playbook and the moment content is cleared to publish.

## 2. Problem

Content teams running AI-assisted production face three compounding failures:

1. **Requirements are scattered.** Brand voice, approved claims, channel rules, and client
   constraints live across briefs, chat threads, and individual memory. Every writer and every AI
   prompt re-derives them, inconsistently.
2. **Review quality varies.** Approval is a Slack thumbs-up or an email "looks good." There is no
   consistent evidence standard for *why* something was cleared, and no verification step between
   generation and human review — so reviewers burn time catching mechanical problems (forbidden
   claims, off-voice copy) that a machine should have flagged.
3. **Approvals leave no usable record.** When a client asks "who approved the post that said X?"
   or a regulator asks for substantiation of a claim, teams reconstruct history from screenshots.

The consequence: agencies cap the number of client accounts a content lead can safely supervise,
and DTC teams either slow down publishing or accept brand/compliance risk.

## 3. Users and personas

### P1 — Agency account/content manager ("the operator")
Oversees 5–20 client accounts. Needs per-client constraints captured once and enforced everywhere.
Success = more accounts supervised at the same quality bar, and defensible evidence when a client
challenges a decision.

### P2 — DTC content lead ("the guardian")
Owns brand voice and claims discipline for one brand across email, social, blog, and paid channels.
Regulated or claim-sensitive verticals (supplements, skincare, fintech, health) are the sharpest
version of this persona. Success = nothing ships with an unapproved claim.

### P3 — Reviewer/approver ("the gate")
Senior editor, compliance reviewer, or the client themselves. Accountable for the publish decision.
Success = a queue that shows exactly what needs attention, why, and one-click-but-deliberate
decisions that are attributed to them.

### P4 — Agency principal (economic buyer)
Buys Galley to raise accounts-per-manager and to convert "trust us" into "here's the record."
Cares about seats, client workspaces, and audit exports — not the editor.

## 4. Jobs to be done

1. Capture a client's operating constraints once, in a reusable, versioned **playbook**.
2. Bring a draft and machine-verified evidence into one **proof surface**.
3. Make approve / request-changes / reject decisions **explicit and attributable**.
4. Preserve the full sequence of inputs, checks, notes, and decisions as an **append-only record**.
5. (Later) Move approved work to **schedule**, publish it, and **report** outcomes against the
   playbook's KPI.

## 5. Core loop and state machine

```
Produce → Verify → Proof → Schedule → Report
```

Deliverable states:

```
drafting → verifying → awaiting_proof → approved → scheduled → published
                          ↘ changes requested → drafting
                          ↘ rejected
                          ↘ escalated
```

**Invariant:** no deliverable reaches `scheduled` or `published` without a recorded human
`approve` action. "Approved" means cleared for scheduling — never auto-published.

## 6. Release phases and scope

### Phase 1 — Validation node (current, largely built)

Objective: prove the proof workflow end to end with placeholder produce/verify stages.

| Capability | Requirement |
|---|---|
| Client playbook setup | Capture account name, website, industry, audience, primary offer, channels, brand voice, approved claims, forbidden claims, competitor URLs, reporting KPI. Versioned; edits create a new version. |
| Draft placeholder | Deliverable with client, type, excerpt, channel, version. No live generation. |
| Verifier placeholder | Deterministic pass/warning/blocked result with plain-language notes tied to playbook constraints. |
| Human proof queue | Inspect evidence; approve / request changes / reject; decisions attributed to the authenticated actor and persisted. |
| Append-only record | Immutable event log per deliverable; corrections append, never mutate (enforced at DB level). |

**Acceptance criteria**

- A new visitor can explain Galley's supervised model after reading the landing hero and trust layer.
- A user completes a client playbook without SEO-specific setup language.
- A reviewer can identify what needs attention, why, and who owns the next decision.
- A proof decision never appears to publish content automatically.
- `events` table rejects UPDATE/DELETE at the database level (verified by script).
- Typecheck, production build, and `validate:galley*` scripts pass.

### Phase 2 — Real verification engine

Objective: replace the verifier placeholder with genuine automated checks; this is Galley's first
real differentiation.

| Capability | Requirement |
|---|---|
| Rule-based checks | Forbidden-claim detection (exact + fuzzy/paraphrase), required-disclosure presence, banned vocabulary, link/URL policy, channel length limits. Deterministic, explainable, versioned rubric. |
| LLM-graded checks | Voice adherence vs. playbook voice definition; claim-paraphrase detection beyond string match; audience-fit note. Each finding cites the playbook constraint it maps to. |
| Verification runs | Immutable per draft version; outcome `pass / warning / blocked`; findings list with evidence spans. |
| Draft intake | Paste/upload drafts and (optionally) create them via API — Galley must verify content produced anywhere, not only content it generates. |
| Multi-user workspaces | Tenant membership, roles (owner, manager, reviewer), per-client assignment; full RLS policies. |

**Acceptance criteria**

- A draft containing a forbidden claim (verbatim or paraphrased in eval set) is flagged `blocked`
  with the claim quoted and the playbook rule cited.
- Verifier precision/recall measured against a golden eval set before launch; rubric version
  recorded on every run.
- Two workspaces can never read each other's data (RLS test suite).

### Phase 3 — Supervised production

Objective: add generation inside the governed loop.

| Capability | Requirement |
|---|---|
| Brief → draft | Generate drafts from a brief + playbook (voice, claims, channel constraints injected). Model + prompt version recorded on the draft. |
| Revision loop | "Request changes" notes feed a regeneration that produces a new immutable version. |
| Human editing | In-place editor; human edits create a new version attributed to the editor; edited drafts re-verify automatically. |
| Cost controls | Per-workspace generation quotas by plan tier. |

**Acceptance criteria**

- Every generated draft carries model, prompt/playbook version, and passes through verification
  before entering the proof queue — no bypass path.
- A reviewer can diff any two versions of a deliverable.

### Phase 4 — Schedule and publish

Objective: close the loop from approval to live content.

| Capability | Requirement |
|---|---|
| Scheduling | Calendar per client; only `approved` deliverables are schedulable (invariant enforced server-side). |
| Publishing integrations | WordPress REST first; then Webflow, Shopify blog, LinkedIn + X (via native APIs or Buffer/Ayrshare-style aggregator). Publish action is itself a recorded event with external ID. |
| Client approval portal | Shareable, permissioned proof link so end clients can approve without a seat. |
| Notifications | Email (and later Slack) alerts for `awaiting_proof`, approvals, failures. |

### Phase 5 — Report and audit exports

Objective: make the record valuable outward.

| Capability | Requirement |
|---|---|
| KPI ingestion | GA4 / Search Console / platform metrics mapped to the playbook's reporting KPI. |
| Client reports | Per-period report: what shipped, what was verified, decision trail, KPI movement. |
| Audit export | Signed PDF/CSV export of a deliverable's full chain of custody. |

## 7. Success metrics

| Metric | Phase | Target (initial) |
|---|---|---|
| Playbook completion rate (signup → first playbook) | 1 | ≥ 60% |
| Time-to-first-proof-decision | 1–2 | < 15 min from signup (demo data), < 1 day (real) |
| Verifier catch rate on golden eval set | 2 | ≥ 90% recall on forbidden claims, ≤ 10% false-block |
| % drafts needing human-caught mechanical fixes | 2–3 | Trending down (verifier absorbing them) |
| Weekly active reviewers per workspace | 2+ | ≥ 2 |
| Deliverables/manager/month | 3+ | Measured, then targeted — no invented multiplier claims |
| Logo retention (agency workspaces) | all | ≥ 90% at 6 months |

## 8. Non-goals (all phases until revisited)

- Autonomous publishing or any "auto-approve" mode.
- A general workflow builder.
- Keyword research / SEO scoring as a headline feature (legacy ContentFlow direction — retired).
- Gamification, vanity analytics, or AI-detection scores.
- Building our own social scheduler UI beyond what the loop needs.

## 9. Guardrails (product-wide)

- Humans remain the publication gate; the system may block, but only humans clear.
- Verifier notes state evidence, not confidence theater.
- Status language describes observable workflow state.
- Claims about capacity/productivity remain qualitative until measured with customer data.
- Claims data (approved/forbidden) is customer IP: exportable, deletable, never used to train
  shared models.

## 10. Open questions

1. Client approval portal: separate cheap role vs. free unlimited client seats (pricing lever).
2. Verification API as a standalone product (verify-only tier for teams with existing tooling)?
3. On the paraphrase detector: embedding similarity vs. LLM judge vs. both — needs eval harness (Phase 2).
4. Which regulated vertical to court first for design-partner depth: supplements/wellness or fintech?

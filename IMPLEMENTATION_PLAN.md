# Galley — Implementation Plan

Phased roadmap from the current validation-node prototype to a revenue product. Each phase has an
objective, workstreams, exit criteria, and an explicit **kill/continue decision**. Scope detail
lives in the [PRD](docs/product/galley-prd.md); stack decisions in [TECH-STACK.md](TECH-STACK.md).

Timeboxes assume a solo founder with AI-assisted development; treat them as sequencing, not dates.

---

## Phase 0 — Repo initiation & hygiene (days)

- [x] Point origin at `https://github.com/CREEDCONSULT/GALLEY.git` and push `main`.
- [x] Archive legacy ContentFlow AI docs to `docs/legacy/`.
- [x] CI on GitHub Actions: `tsc --noEmit`, `eslint`, `next build`, `validate:galley*`.
- [x] Rewritten CLAUDE.md / DESIGN.md / PRD / TECH-STACK / TOOLS_AND_APIS / BUSINESS_PLAN / PLAN.
- [x] `.env.example` updated to actual required vars (Convex).

**Exit:** clean repo on GALLEY.git with green CI. ✅ complete

## Phase 1 — Backend + auth on Convex, deployed (mostly complete)

The prototype is now a persisted, authenticated, deployed app.

**Workstreams**
1. [x] **Backend on Convex** — schema + mutations in `convex/`; playbooks versioned; proof
   decisions, drafts, verifications, and events fully persisted; demo seed/reset. Supabase removed.
2. [x] **Auth** — Convex Auth (Password); `memberships` table (owner/manager/reviewer); routes
   protected by middleware; proof decisions require an authenticated actor and attribute to the
   real user. *(Remaining: enforce per-user tenant scoping on the create paths — onboarding and
   intake — not just proof decisions.)*
3. [x] **Deploy** — Railway `galley-web` live from `main`; verified in production (sign up →
   protected proof queue → attributed approval in the record).
4. [ ] **Test harness** — Vitest + Playwright + an automated append-only / approval-gate / tenant
   isolation suite in CI (currently covered by `smoke:galley:convex` + `validate:galley*`).

**Exit criteria:** two workspaces provably isolated; automated invariant tests green in CI.
**Status:** live user flow works end-to-end in production; automated isolation tests still to add.

## Phase 2 — Real verification engine (4–6 weeks) ← the bet

**Workstreams**
1. [x] **Rules engine (deterministic)** — `lib/galley/verifier.ts`, rubric `galley-rules-v0.2`:
   forbidden-claim fuzzy match, channel policy, substance check, FTC substantiation-risk warnings,
   approved-claim evidence notes. 8-check contract in CI. *(Next: required disclosures, link policy,
   channel length limits.)*
2. **LLM-graded checks** — voice adherence + claim-paraphrase detection (Claude; Haiku-first
   routing). Model + rubric version stamped on every run.
3. **Eval harness** — golden set of real violations (seeded from design partners); measure
   precision/recall per rubric version; gate releases on ≥90% forbidden-claim recall, ≤10%
   false-block (PRD §7).
4. **Draft intake** — paste/upload drafts; verification API seam (`POST /verification-runs`).
5. **Background jobs** — durable verification runs (Supabase queues → Inngest if needed).
6. **Design partners** — recruit 5–10 agencies + 2–3 claim-sensitive DTC brands in parallel;
   weekly feedback; they feed the eval set.

**Exit criteria:** design partners run real drafts through verification weekly; eval metrics hit
gates; at least 3 partners say they'd pay (pricing test per BUSINESS_PLAN §4).
**Kill/continue:** if partners won't put real drafts through it or the verifier can't clear the
eval gates after two rubric iterations, stop and reassess before building generation.

## Phase 3 — Monetize + supervised production (4–6 weeks)

**Workstreams**
1. **Billing** — Stripe subscriptions on per-workspace tiers (Studio/Agency/Agency Plus);
   quota enforcement.
2. **Generation in the loop** — brief → draft with playbook injection; regeneration from
   change-request notes; every draft verified before entering the proof queue (no bypass).
3. **Editor + versions** — TipTap editor; human edits create attributed versions; re-verify on edit;
   version diffs in the proof surface.
4. **Notifications** — Resend emails for `awaiting_proof`, decisions, failures.
5. **Launch** — public pricing, compliance-angle content GTM (BUSINESS_PLAN §5 Phase B).

**Exit criteria:** first 8–10 paying workspaces (≈$2.5K MRR scenario milestone); activation funnel
instrumented in PostHog (signup → playbook → first proof decision ≥ 40%).
**Kill/continue:** if conversion from engaged design partners to paid is < 30%, revisit pricing or
wedge vertical before scaling GTM spend.

## Phase 4 — Schedule & publish (4–6 weeks)

1. Scheduling calendar; server-enforced approved-only scheduling.
2. WordPress REST publishing (first target), then Webflow; social via aggregator decision
   (TOOLS_AND_APIS §Phase 4). Publish = recorded event with external ID.
3. Client approval portal (permissioned share links — no seat required); portal is also the
   viral loop.
4. Slack notifications.

**Exit criteria:** ≥ 50% of active workspaces publish through Galley; portal used by end clients
at ≥ 25% of agency workspaces.

## Phase 5 — Report & audit exports (3–4 weeks)

1. GA4 / Search Console ingestion mapped to playbook KPI.
2. Per-period client report (shipped / verified / decision trail / KPI movement).
3. Signed PDF/CSV audit export with payload hashes.

**Exit criteria:** reports generated for ≥ 30% of workspaces monthly; first Enterprise/DTC deal
citing audit exports.

---

## Cross-cutting tracks (every phase)

- **Invariants:** the six CLAUDE.md invariants are release gates — any PR weakening them is
  rejected regardless of feature value.
- **Security:** RLS tests in CI; server-side timestamps/actor IDs; encrypted integration
  credentials (Phase 4+).
- **Docs:** PRD/TECH-STACK updated in the same PR as behavior changes.
- **Metrics:** PostHog events named after the loop (`proof.decision_made`, `verification.blocked`,
  …) from Phase 1 onward.

## Dependency graph

```
Phase 0 → Phase 1 → Phase 2 ─┬→ Phase 3 → Phase 4 → Phase 5
                             └→ (design partners feed eval set, pricing, and GTM throughout)
```

Phases 4 and 5 can partially overlap Phase 3 once billing is live; nothing overlaps Phase 2's
eval gates — verification quality is the product.

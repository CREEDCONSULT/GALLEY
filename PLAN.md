# Galley — Master Plan

**Galley is a supervised content-operations agent for agencies and DTC teams. Proof before press.**
AI produces and verifies content against a per-client playbook; a human always makes the publish
decision; every decision lands in an append-only record.

This document is the index and the one-page strategy. Everything else is a level deeper.

## The thesis in three sentences

1. Marketers have adopted generative AI at ~90% penetration, but 47% hit hallucinations weekly and
   regulators (FTC Operation AI Comply; $51,744-per-violation Fake Reviews Rule) have made
   unverified claims a quantifiable liability.
2. The market splits into AI writers with no governance, approval tools with no verification, and
   enterprise governance platforms with a $10K/yr floor — nobody serves agencies at $99–599/mo
   with verification + a human publish gate + an audit record.
3. Galley occupies that gap with a governed loop (Produce → Verify → Proof → Schedule → Report)
   whose invariants — human gate, append-only record — are enforced in the database, not the pitch.

## Document map

| Document | What it answers |
|---|---|
| [BUSINESS_PLAN.md](BUSINESS_PLAN.md) | Market, competition, pricing, GTM, financial scenario, risks |
| [docs/business/market-research-2026-07.md](docs/business/market-research-2026-07.md) | The cited evidence base (sources + reliability flags) |
| [docs/product/galley-prd.md](docs/product/galley-prd.md) | Personas, jobs, phased feature requirements, acceptance criteria, metrics |
| [docs/architecture/galley-technical-design.md](docs/architecture/galley-technical-design.md) | Domain model, state machine, security requirements, API seams |
| [TECH-STACK.md](TECH-STACK.md) | Stack decisions by phase; what's deliberately excluded |
| [TOOLS_AND_APIS.md](TOOLS_AND_APIS.md) | Every third-party service, cost, and the no-invariant-outsourcing rule |
| [DESIGN.md](DESIGN.md) | Design principles, tokens, status semantics, component and copy rules |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Phase 0–5 roadmap with exit criteria and kill/continue gates |
| [CLAUDE.md](CLAUDE.md) | Working-in-this-repo guide: commands, architecture map, invariants |
| `docs/legacy/` | Pre-pivot ContentFlow AI documents — historical context only |

## Where we are (July 2026)

**Built and deployed:** Next.js 16 + **Convex** validation node, live at
`https://galley-web-production.up.railway.app` (Railway, auto-deploys from `main`). Playbook
onboarding, draft intake, proof queue, records view; append-only event log enforced in Convex
mutations; approval-before-scheduling invariant. **Two-layer verification:** deterministic rules
engine (`galley-rules-v0.3`) inside mutations, then an **LLM-graded second pass** (Claude Haiku,
`galley-llm-v0.1`) that escalates paraphrased forbidden claims and voice mismatches — measured to
close 5/5 of the deterministic gap. An 18-case golden **eval harness** gates CI on PRD §7 thresholds.
**Convex Auth** (email+password): routes protected, proof decisions require an authenticated actor
and attribute to the real user in the record (verified live in production).

**Not built:** generation, billing, publishing, reporting; team invites (workspaces are
single-owner today); a production (non-dev) Convex deployment.

**Resolved decisions:** backend = Convex (Supabase removed), auth = Convex Auth, hosting = Railway.

## The immediate path (from IMPLEMENTATION_PLAN.md)

1. **Phase 0 (days):** repo hygiene, CI, this document set. ✅ complete
2. **Phase 1 — backend + auth on Convex, deployed. ✅ mostly complete** (remaining: full
   per-function tenant isolation on create paths; automated invariant test suite).
3. **Phase 2 (4–6 wks) — the bet:** two-layer verifier shipped (deterministic + LLM-graded second
   pass) with a golden eval harness gating CI. Next: recruit 5–10 design partners to feed the eval
   set real violations. *Kill/continue gate: partners run real drafts weekly and the verifier hits
   ≥90% recall / ≤10% false-block.*
4. **Phase 3:** Stripe billing + supervised generation → first paying workspaces.
5. **Phases 4–5:** publish integrations + client portal, then reporting and audit exports.

## Operating principles

- **Verification quality is the product.** No phase overlaps Phase 2's eval gates.
- **Invariants are release gates.** The human publish gate and append-only record are enforced in
  Convex mutations (the sole write path); no feature ships that weakens them.
- **No invented numbers.** Product copy and this plan only claim what's measured; research figures
  carry sources and reliability flags.
- **One stack until it hurts.** Next.js + Convex + Railway; additions are phase-justified.

## Decisions still open (owners: founder + design partners)

1. First wedge vertical: supplements/wellness vs. fintech (decide by end of Phase 2 recruiting).
2. Paraphrase detection: embeddings vs. LLM-judge vs. both (eval harness decides).
3. Social publishing: aggregator (Ayrshare-style) vs. direct APIs (volume decides, Phase 4).
4. Verification-only API tier: promote up the roadmap if design partners pull for it.

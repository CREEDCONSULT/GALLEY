# Galley — Business Plan

**Company:** CREED CONSULT · **Product:** Galley — supervised content-ops agent
**Prepared:** July 2026 · **Basis:** live market research, July 2026 (sources cited inline; full
research brief in [docs/business/market-research-2026-07.md](docs/business/market-research-2026-07.md))

---

## 1. Executive summary

Galley is a supervised content-operations platform for marketing agencies and DTC brand teams.
AI produces and verifies content against a per-client **playbook** (brand voice, approved claims,
forbidden claims, channel rules); a **human always makes the publish decision**; and every input,
check, note, and decision is preserved in an **append-only audit record**. Tagline: *Proof before
press.*

The wedge: AI writing tools have no governed approval loop; approval tools (Gain, Planable) have
no AI verification or claims compliance; claims-compliance platforms (Writer.com, Acrolinx) start
at ~$10K/year and are not agency-shaped. **No competitor found combines AI verification + human
publish gate + append-only audit at agency-affordable per-client-workspace pricing.** Galley sits
in that gap at $99–$599/month.

Why now: 87% of marketers now use generative AI in at least one workflow (Salesforce State of
Marketing 2026, secondary citation), while 47% encounter AI hallucinations weekly and 36.5% admit
hallucinated content has been published (NP Digital, 2025). The FTC's Operation AI Comply and the
Fake Reviews Rule (civil penalties up to $51,744 per violation; FTC, 2024) turn unverified claims
into quantifiable per-post legal exposure. Content that ships wrong is no longer just embarrassing
— it is expensive.

## 2. Market

### Size

- Generative AI in content creation: **$14.8B (2024) → $80.1B (2030), 32.5% CAGR** (Grand View
  Research, 2024).
- Content marketing software: sources diverge by segmentation — **$12.1B–$33.1B (2024/25)**
  growing 5–18% CAGR (Mordor Intelligence 2025; Research and Markets 2025; Maximize 2024). Treat
  as a range.
- Buyer universe: **100,202 US digital advertising agencies (2026), a $53.4B market growing
  +14.9% YoY** (IBISWorld report 5889) — fragmented, fast-growing, tool-hungry. Global ad agency
  market: $444.7B (IBISWorld, 2025).

### Serviceable market (bottom-up)

Target: US digital agencies with 2–50 staff managing multiple client accounts, plus claim-sensitive
DTC teams (supplements, skincare, fintech, wellness). If 10% of the ~100K US digital agencies fit
the profile (~10,000) at a $3,600–$7,200 blended ACV, the near-term serviceable market is roughly
**$36M–$72M ARR in the US agency niche alone**, before DTC in-house teams and international. (Our
derivation from IBISWorld counts; flag as estimate.)

### Why now (demand signals, all sourced)

1. **AI volume without AI trust.** 91% of marketing leaders say their teams use AI (HubSpot 2025);
   >70% of marketers spend hours weekly fact-checking AI output (NP Digital 2025). At agency
   billing rates of $100–200/hr, 5 hrs/week of manual QA ≈ **$2,000–$4,000/month of labor** —
   Galley's displacement anchor.
2. **Incidents are common and costly.** >70% of advertisers have had an AI-related incident; 40%
   had to pause or pull campaigns; ~33% suffered brand damage (IAB, 2025). Suspected AI content
   halves reader trust (Raptive, 2025).
3. **Regulators moved.** FTC Operation AI Comply (12+ enforcement actions since Sept 2024) and the
   Fake Reviews Rule ($51,744/violation) make substantiation and provenance a compliance
   requirement, not a nice-to-have (FTC 2024–25; Benesch 2025).
4. **Approval is already the bottleneck.** 89% of marketers report 3+ approval stages; 58% say
   over 40% of their time goes to managing reviews (Storyteq 2025 — vendor research, directional).
5. **Google rewards accountability.** No AI-content penalty per se, but "scaled content abuse"
   enforcement (March 2024 core update) makes human editorial responsibility the practical
   E-E-A-T mitigation (Google Search Central).

## 3. Product (summary — full detail in [PRD](docs/product/galley-prd.md))

The governed loop: **Produce → Verify → Proof → Schedule → Report.**

1. **Playbook** — versioned per-client constraints: voice, approved/forbidden claims, channels, KPI.
2. **Verify** — deterministic rules + LLM-graded checks; every finding cites the playbook rule.
3. **Proof** — a human queue; approve / request changes / reject; attributed and persisted.
4. **Record** — append-only chain of custody, enforced at the database level (already built).
5. **Schedule/Report** — publish integrations and KPI reporting close the loop (Phases 4–5).

Differentiator vs. each adjacent category:

| Category (examples) | What they have | What they lack |
|---|---|---|
| AI writing (Jasper $39–125/seat; Copy.ai $29–1,000/mo) | Generation, brand-voice prompts | Governed approval, claims enforcement, audit record |
| Approval workflow (Gain $99/mo per 6 clients; Planable $33–49/workspace) | Client approval rounds | AI verification, claims compliance, immutable record |
| Enterprise governance (Writer $10K–250K/yr; Acrolinx custom) | Claims/style enforcement | Agency shape and price; publish-gate workflow |
| Social suites (Sprout $299–399/seat; Hootsuite approvals from $249/mo) | Scheduling + approvals | Content-aware verification; per-seat pricing punishes multi-approver agencies |

## 4. Business model

**Pricing model: per client workspace, unlimited reviewers.** This is the proven agency convention
(Gain, Planable price this way; Vendr/G2 2025) and aligns our unit with agency revenue units.
Approvers are free — every extra reviewer strengthens the record.

| Tier | Price | Included | Target |
|---|---|---|---|
| **Studio** | $99/mo | 3 client workspaces, verification + proof + record, 2 team seats | Freelancer / micro-agency |
| **Agency** | $299/mo | 10 client workspaces, unlimited reviewers, client approval portal, publish integrations | Core: 5–20-client agencies |
| **Agency Plus** | $599/mo | 25 workspaces, audit exports, Slack, SSO-lite, priority support | Larger agencies, claim-sensitive verticals |
| **Enterprise/DTC** | Custom ($6K–$20K/yr) | Single-brand unlimited channels, compliance workflows, API | Regulated DTC, in-house teams |

Benchmarks supporting the corridor: a 10-client agency already pays ~$490/mo on Planable Pro or
~$900/mo for 3 Sprout seats — for approval alone, with no verification. Between Grammarly Business
($15/seat, no workflow) and Writer ($10K/yr floor) there is **no product at $200–$1,000/mo** — the
corridor Galley occupies. Agencies spend ~3.7% of revenue on software (~$675/employee/mo derived;
RevenueMemo 2026 — flagged inference).

**Unit economics targets** (benchmarks: Benchmarkit 2025; KeyBanc/Sapphire 2024; Optifai 2025):

- Gross margin: ≥ 75% (SaaS median 77%; AI COGS budgeted < 15% of MRR, Haiku-first routing;
  verification target < $0.05/run).
- LTV:CAC ≥ 3:1 (B2B median 3.2:1); CAC target < $1,200 via content-led + community GTM.
- Churn: plan for 3–5% monthly logo churn in SMB agency segment (Optifai 2025: SMB 3–7%/mo);
  mitigations: the record is data gravity (evidence history is painful to abandon), playbooks are
  accumulated client IP, and annual plans.

## 5. Go-to-market

**Phase A — design partners (months 0–4).** 5–10 hand-picked agencies + 2–3 claim-sensitive DTC
brands (supplements/skincare/fintech). Free or steeply discounted in exchange for weekly feedback
and eval-set contributions (real forbidden-claim examples). Goal: verifier catch-rate proof and 3
referenceable case studies with *measured* (not invented) numbers.

**Phase B — niche-down launch (months 4–9).** Positioning: "the proof layer for AI content."
Channels, in priority order:
1. Compliance-angle content (FTC enforcement explainers, claim-checklist lead magnets) — the
   regulatory hook is underexploited and time-sensitive.
2. Agency communities/newsletters and integration marketplaces (WordPress, Slack, later Webflow).
3. Founder-led outbound to agencies in the wedge verticals; demo = live proof queue on the
   prospect's own claims list.

**Phase C — expand (months 9–18).** Client-portal virality (every agency's clients see Galley),
verification-API tier for teams with existing tooling, partnerships with agency ops consultants.

**Sales motion:** self-serve trial with demo workspace + founder-assisted close for Agency Plus and
Enterprise (median low-ACV martech sales cycles are days, not months; GetMonetizely 2025).

## 6. Competition — defensibility

Moats, in order of durability:
1. **The record.** Append-only chain of custody accumulates evidentiary value; switching means
   abandoning your audit history.
2. **Playbook + eval corpus.** Per-client claims rules and the golden eval set of real violations
   improve verifier precision in ways a generic LLM wrapper can't copy.
3. **Workflow position.** Sitting at the approval gate (not the editor) means Galley coexists with
   any generation tool a team already loves — low displacement friction in, high friction out.

Realistic threats: Planable/Gain adding AI checks (workflow → verification is easier than the
reverse — speed matters); Writer moving down-market; platform-native approvals (Notion AI,
Monday). Response: own the regulated-claims niche deeply and keep the record/database invariants
as the product's spine — features competitors would need to re-architect to match.

## 7. Financial plan (scenario, not a promise)

Assumptions: $299 blended starting ARPA rising toward $380 with Plus/Enterprise mix; 4% monthly
logo churn improving to 2.5% with annual plans; founder-led sales; AI COGS 10–15% of MRR.

| Milestone | Workspaces (paying accounts) | MRR | Timing (scenario) |
|---|---|---|---|
| Design partners convert | 8 | ~$2.4K | Month 6 |
| Ramen-profitable ops | 35 | ~$11K | Month 12 |
| Seed-ready traction | 120 | ~$42K | Month 18–24 |

Costs: fixed infra $150–400/mo (see [TOOLS_AND_APIS.md](TOOLS_AND_APIS.md)); dominant cost is
founder time until ~$20K MRR, then first hires: founding engineer, then part-time compliance
content marketer. Funding stance: bootstrap/pre-seed through Phase B; raise only to accelerate a
working motion.

## 8. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Verifier under-delivers (misses claims / over-blocks) | Med-High | Golden eval set before launch; precision/recall gates in PRD §7; deterministic rules carry the compliance load, LLM adds judgment |
| Category confusion ("another AI writing tool") | High | Never lead with generation; lead with proof + record; compliance content GTM |
| Incumbent adds verification | Med | Speed to the regulated niche; record architecture as moat |
| SMB churn economics | Med | Per-workspace pricing scales with agency growth; annual plans; data gravity |
| LLM cost/behavior drift | Med | Rubric + model version pinned per run; multi-model routing; COGS budget alarms |
| Regulatory hook cools | Low | Enforcement has persisted across administrations (Benesch 2025); trust/QA pain exists independent of the FTC |
| Solo-founder execution risk | High | Phased plan with kill/continue criteria per phase ([IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)) |

## 9. Honest unknowns (to resolve with design partners)

- Direct willingness-to-pay for verification as a category — triangulated from adjacent tools, not
  surveyed (research brief §5 flag). Design-partner pricing tests answer this.
- Whether agencies or DTC compliance teams convert faster (pick the wedge by month 4).
- Verification-only vs. full-loop adoption split — shapes whether the API tier moves up the roadmap.

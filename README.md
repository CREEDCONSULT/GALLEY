# Galley

**The supervised content-ops agent for agencies and DTC teams. Proof before press.**

Galley coordinates a governed content loop — **Produce → Verify → Proof → Schedule → Report** —
where AI drafts and verifies content against a per-client playbook (brand voice, approved and
forbidden claims, channel rules), a human always makes the publish decision, and every input,
check, and decision is preserved in an append-only record.

## Status

V1 validation node: playbook onboarding, proof queue, and a database-enforced append-only audit
record are implemented. Real verification is the current milestone — see
[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # add your Supabase project keys
npm run dev                  # http://localhost:3000
```

Useful checks:

```bash
npx tsc --noEmit                       # typecheck
npm run lint                           # eslint
npm run validate:galley                # domain invariants (mock)
npm run validate:galley:persistence    # persistence invariants
npm run smoke:galley:supabase          # live Supabase smoke test
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Auth, Postgres, RLS)
· Vercel. Details: [TECH-STACK.md](TECH-STACK.md).

## Documentation

Start at [PLAN.md](PLAN.md) — the master plan and document index (business plan, PRD, design
system, tech stack, third-party APIs, implementation roadmap). Contributor guide: [CLAUDE.md](CLAUDE.md).

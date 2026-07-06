# Galley Design System

> The proof room, not the print floor.

Galley's interface borrows its metaphor from typesetting: a **galley proof** is the version an
editor marks up before anything is committed to press. The UI should feel like a well-lit proofing
desk — dark, calm, evidence-forward — where one human decision at a time is made deliberately.

Structural inspiration (density, hairline borders, restrained accent usage) comes from
[docs/design/style-reference-linear.md](docs/design/style-reference-linear.md). Galley's palette,
voice, and status semantics below are canonical and override that reference wherever they differ.

---

## 1. Design principles

1. **Evidence over adornment.** Every surface exists to help a reviewer answer: *what is this,
   what did the verifier find, who decides next?* Decoration that doesn't serve that question is cut.
2. **One decision per screen.** The proof queue presents a single deliverable's evidence and three
   actions (approve / request changes / reject). Never stack competing calls to action.
3. **Status is observable state, not mood.** Status chips map 1:1 to the deliverable state machine.
   No "🎉 Almost there!" language. No progress theater.
4. **Consequence is visible.** Actions that append to the permanent record look heavier than
   actions that don't. Approve is never the biggest, brightest, easiest-to-fat-finger button by
   accident — it is deliberate.
5. **The human is the subject.** Copy addresses the reviewer as the decision-maker ("You approved
   this on…"), never as a spectator of automation.
6. **No unsupported claims.** Marketing and product surfaces state what Galley observably does.
   Capacity/performance claims stay qualitative until measured with customer data.

## 2. Color tokens (canonical — `app/globals.css`)

### Core palette

| Token | Value | Role |
|---|---|---|
| `--galley-ink` | `#080807` | Page canvas (near-black, warm) |
| `--galley-charcoal` | `#171615` | Card / panel surface (`--surface`) |
| `--surface-raised` | `#1d1b19` | Elevated panels, modals |
| `--galley-graphite` | `#2b2926` | Muted surface, default borders |
| `--border-strong` | `#4a4641` | Emphasized hairlines, focus edges |
| `--galley-bone` | `#e8dfd1` | Soft ink — secondary text (`--ink-soft`) |
| `--galley-paper` | `#f7f3ea` | Primary text, headings (`--foreground`) |
| `--slate` | `#8b8378` | Tertiary text, inactive icons |
| `--muted` | `#aaa397` | Muted body text, metadata |
| `--galley-brass` | `#b89b5e` | Primary accent — CTAs, active nav (`--primary`) |
| `--primary-strong` | `#c9ad70` | Hover/active brass |
| `--galley-blue` | `#2f6bff` | Proof blue — verification, informational |
| `--galley-green` | `#4d8b5a` | Success / approved |
| `--galley-yellow` | `#e7c86a` | Warning / awaiting human attention |
| `--galley-red` | `#d94a38` | Danger / rejected / escalated |

Brass is the only chromatic accent for actions; blue/green/yellow/red are **status colors only**.
Do not introduce new accent hues.

### Status colors (map 1:1 to the state machine)

| State | Token | Color intent |
|---|---|---|
| `drafting` | `--status-drafting` | Slate — machine at work, low urgency |
| `verifying` | `--status-verifying` | Proof blue — checks running |
| `awaiting_proof` | `--status-awaiting-proof` | Yellow — **a human is needed** |
| `approved` | `--status-approved` | Green — cleared for scheduling |
| `scheduled` | `--status-scheduled` | Brass — committed to a date |
| `published` | `--status-published` | Green — live |
| `rejected` | `--status-rejected` | Red — stopped by a human |
| `escalated` | `--status-escalated` | Red — needs senior attention |

Yellow (`awaiting_proof`) is the most important signal in the product: it means the queue is
waiting on a person. It should be the first thing a reviewer's eye finds on the dashboard.

## 3. Typography

- **Sans**: Inter (system-ui fallback) — all UI, headings, body. Weights 400–600; avoid 700+.
- **Mono**: SFMono/Consolas stack — event IDs, hashes, timestamps, rubric versions, diff output.
  Mono text signals "this is evidence / part of the record."
- Display headings: tight tracking (−0.02em) at 48px+; body 15–16px at line-height 1.5–1.6.

## 4. Space, shape, elevation

- Base unit 4px; compact density (8/12/16/24 for component padding; 64–96px section gaps on marketing pages).
- Radii: cards 12px, buttons/inputs 6px, badges 4px, pills 9999px. Nothing larger.
- Elevation via surface steps (`ink → charcoal → raised`) and 1px hairline borders
  (`--border`, `--border-strong`) — not shadow stacks.
- Max content width 1200px; proof-review surfaces may use a two-pane layout
  (evidence left, decision rail right).

## 5. Component rules

- **Status chip**: 4px radius, 12–13px text, tinted background at ~12% opacity of its status color,
  full-strength text/dot. Always shows the literal state name (e.g., "Awaiting proof").
- **Proof action buttons**: Approve (brass fill, ink text), Request changes (ghost with
  `--border-strong`), Reject (red outline; red fill only on confirm step). All three require the
  actor to be authenticated; disabled states must explain why.
- **Verifier findings panel**: each finding = rule name + plain-language evidence + the playbook
  constraint it maps to. Findings are never summarized into a single score without the list.
- **Record/event rows**: mono timestamps, actor label + actor type badge (`human`, `verifier`,
  `generator`, `system`), immutable-feeling (no hover affordances that imply editability).
- **Forms (playbook setup)**: one concept per field group; approved/forbidden claims are explicit
  list editors, not free-text blobs.
- **Empty states**: state what will appear and which step produces it ("Verifier findings appear
  here after a draft is produced") — never mock data pretending to be real.

## 6. Motion

Framer Motion, sparingly: 150–250ms ease-out fades/slides for panel entry and queue transitions.
No spring bounce on record or decision surfaces — consequence should feel settled, not playful.
Respect `prefers-reduced-motion`.

## 7. Voice and copy

- Verbs describe the loop: *produce, verify, proof, schedule, report.*
- Decisions are attributed: "Approved by Dana Reyes · 14:02 UTC".
- Verifier language states evidence: "Contains forbidden claim: 'clinically proven'" — never
  "Quality score 87!".
- Forbidden vocabulary: "magic", "instantly", "10x", "autopilot", "set and forget", and any
  unverified performance statistic.

## 8. Accessibility

- Text contrast ≥ 4.5:1 on all surfaces (paper-on-ink passes; verify status tints).
- Status is never color-alone: chips always carry the state label; findings carry icons + text.
- Full keyboard path through the proof queue: navigate deliverables, open evidence, act — with
  visible focus rings (`--border-strong` outline minimum).
- Destructive/record-appending actions get an explicit confirm step, announced to screen readers.

## 9. Screen inventory (V1)

| Route | Purpose | Key components |
|---|---|---|
| `/` | Positioning + governed-loop explanation | Hero, loop diagram, trust layer |
| `/login` | Auth | Supabase auth form |
| `/onboarding` | Client playbook setup | Multi-step form, claims list editors |
| `/dashboard` | Validation-node overview | Queue summary, status chips, client switcher |
| `/dashboard/proof` | Proof queue | Evidence pane, findings panel, decision rail |
| `/dashboard/records` | Append-only record | Event timeline, actor badges, mono metadata |

Any new screen must declare which loop stage it serves before it gets designed.

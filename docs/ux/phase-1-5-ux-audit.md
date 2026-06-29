# Galley Phase 1.5 UX Audit

## Audit scope

Reviewed the landing page, proof queue, records, dashboard overview, client playbook setup, login, and settings at the default desktop viewport and at 375–390px mobile widths. The review covered product clarity, hierarchy, spacing, action semantics, status consistency, responsive behavior, accessibility fundamentals, and copy.

The in-app browser successfully supported DOM, layout, interaction, and responsive checks. Screenshot capture repeatedly timed out before returning an image, so no heavy replacement dependency was installed. This document is the visual QA fallback requested for Phase 1.5.

## What works

- The ink, paper, bone, and brass system is distinctive without becoming theatrical.
- “Proof before press.” is immediate and specific.
- Product UI, not an abstract AI illustration, carries the landing-page story.
- The workflow is consistently described as Produce → Verify → Proof → Schedule → Report.
- Proof, verifier evidence, and the human gate are visible in the same experience.
- The interface clearly labels scheduling, publishing, generation, and persistence as future or prototype behavior.
- Desktop routes showed no horizontal overflow during inspection.
- The client playbook collects the correct brand, claims, channel, audience, and reporting context.
- The record already has the right conceptual ingredients: actor, time, event, version, playbook, destination, and immutable sequence.
- No fake traffic, SEO growth, revenue, or velocity metrics remain in the Phase 1 routes.

## What feels premium

- The disciplined serif/sans pairing creates editorial authority.
- Fine borders and largely opaque surfaces feel more like a proofing desk than a generic SaaS card grid.
- Monospaced run IDs, labels, timestamps, and statuses create a quiet operational tone.
- The large landing headline has confident negative space and a clear primary action.
- The proof queue and record use evidence as the visual centerpiece.
- Brass is reserved for emphasis, while blue, red, green, and yellow retain system meaning.

## What felt generic before refinement

- Repeating the same bordered-card treatment across every section risked becoming a template pattern.
- The dashboard greeting was generic and less useful than a decision-oriented headline.
- The proof queue displayed approve, edit, and reject controls on work that was already approved, scheduled, or rejected.
- Dashboard mock clients and counts did not match the proof queue, which weakened trust.
- The onboarding preamble occupied too much of the first mobile viewport before the first field.
- The record timeline was credible, but its chain of custody had to be inferred from the event list.
- `/settings` returned a generic 404 while the actual route lived under `/dashboard/settings`.

## What still needs refinement later

- Real records will need server timestamps, authenticated actors, immutable event storage, and export behavior.
- Real proof decisions will need reason capture for rejection and requested edits.
- A future playbook detail view should expose version history and the exact rules used by a verification run.
- Mobile testing should eventually include physical devices and assistive technology, not only viewport emulation.
- A formal WCAG contrast audit should be run once the final font rendering and production shell are stable.
- Loading, error, and empty states should be tested against real asynchronous data once a backend exists.

## Page-by-page critique

### Landing page

The hero is the strongest brand surface: one declarative message, a clear category statement, and proof UI beside it. The workflow, product preview, custody record, security, and agency sections tell a coherent story. The page is long, but each section has a distinct job. The primary risk is visual repetition from bordered grids; future additions should resist adding more feature-card rows.

Refinement applied: retained the strong hierarchy, verified mobile CTAs span the available width, and confirmed the 64px mobile headline fits without horizontal overflow.

### Proof Queue

This is correctly positioned as the central workspace. Status filters, verifier evidence, client context, and record access are all present. Before refinement, actions had equal visual weight and appeared on lifecycle states where they were no longer valid.

Refinements applied: the queue now opens on “Awaiting proof,” the approval action is dominant, edit/reject are subordinate, status badges include icons as well as color, and non-actionable states explain why proof controls are absent. The subcopy now accurately covers both verification and proof states.

### Records

The event timeline is calm and legible, and the prototype disclosure prevents the mock history from being mistaken for live audit storage. The timeline needed a stronger summary of provenance.

Refinements applied: added a Source → Check → Decision → Destination custody strip and event-kind labels. The record now communicates its logic before the user reads all seven events.

### Dashboard overview

The overview avoids fake analytics and presents the operating loop. Before refinement, its personalized greeting and mock counts were generic, and its clients did not match the proof queue.

Refinements applied: replaced the greeting with a decision-oriented headline, aligned clients and states with the proof queue, corrected run counts, added playbook provenance language, and compacted the workflow to a two-column mobile grid.

### Client playbook setup

The three chapters are correct and the final warning clearly says approval does not publish. The form needed more semantic grouping and faster mobile access to the first field.

Refinements applied: compacted the mobile introduction and progress rail, grouped account identity separately from audience and offer, added purposeful helper copy, marked competitor URLs optional, updated sample content to match the proof queue, and made the playbook’s source-of-truth role explicit.

### Login

The login is restrained and clear. “Workspace access,” magic-link copy, and the note about playbooks and records support the trust posture. No visual restructuring was necessary.

### Settings

The actual settings screen honestly limits itself to Phase 1 controls. The short `/settings` route previously failed.

Refinement applied: added a redirect from `/settings` to `/dashboard/settings` and replaced non-functional workspace/sign-out controls in the shell with static workspace identity and a truthful workspace-access link.

## Top 10 design fixes

1. Make “Approve draft” the dominant proof action. — Applied.
2. Remove proof controls from already approved, scheduled, rejected, or still-verifying work. — Applied.
3. Add icon-plus-text status badges so status never depends on color alone. — Applied.
4. Default the core workspace to the items that actually require a human decision. — Applied.
5. Align dashboard mock data with the proof queue. — Applied.
6. Replace the generic dashboard greeting with decision-oriented hierarchy. — Applied.
7. Add an at-a-glance custody structure above the record timeline. — Applied.
8. Reduce mobile onboarding preamble and group fields by reviewer intent. — Applied.
9. Compact the five-stage workflow on mobile without losing sequence. — Applied.
10. Respect reduced-motion preferences globally. — Applied.

## Top 10 product clarity fixes

1. State that approval advances a version but does not publish it. — Present across dashboard, onboarding, and settings.
2. Keep the human gate visible in the shell and proof queue. — Present.
3. Explain that every decision enters the record. — Present.
4. Make the Proof Queue the first dashboard navigation item and default decision view. — Applied.
5. Describe the playbook as the source of truth for verification and proof. — Applied.
6. Distinguish “Verifying” from “Awaiting proof.” — Applied.
7. Explain why actions are unavailable after a lifecycle transition. — Applied.
8. Keep prototype generation, scheduling, publishing, and records explicitly labelled. — Present.
9. Keep agency and DTC language visible in the public positioning. — Present.
10. Replace fake operational totals with observable queue states. — Applied.

## Mobile and responsive notes

- Tested at 375–390px widths with no page-level horizontal overflow.
- Landing CTAs resolve to full-width 52px-high controls, and the hero remains readable at 64px.
- The dashboard sidebar correctly becomes mobile navigation.
- Proof action buttons fit the mobile card width and retain adequate separation.
- The dashboard workflow now uses two columns, with the final stage spanning the row.
- Onboarding previously delayed the first field until roughly 600px down the page; the compact progress layout materially reduces this cost.
- The record summary and timeline stack cleanly; the custody summary uses two columns on mobile.

## Accessibility notes

- Form controls use explicit labels, and required onboarding fields use native `required` semantics.
- Focus states use the high-contrast proof accent.
- Statuses combine words, icons, and color.
- Proof decisions report changes through an `aria-live` status region.
- Filter buttons expose pressed state.
- Reduced-motion preferences disable non-essential animation and smooth scrolling.
- Disabled actions were removed from irrelevant proof states rather than left unexplained.
- Remaining follow-up: formal contrast measurement, full keyboard traversal, screen-reader testing, and zoom testing at 200–400%.

## Copywriting notes

- Strongest copy is short and operational: “Proof before press,” “One decision is waiting,” and “Nothing publishes without approval.”
- “Source of truth,” “recorded decision,” and “chain of custody” reinforce accountability without compliance jargon.
- Avoid adding productivity claims until account-capacity outcomes are measured with customers.
- Keep “AI” out of primary interface copy; users need provenance and status, not model theatre.
- Use “approved for the next stage,” never language that implies approval automatically publishes.

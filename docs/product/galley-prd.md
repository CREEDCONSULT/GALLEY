# Galley V1 Product Requirements

## Product statement

Galley is the supervised content-ops agent for agencies and DTC teams. Its promise is simple: **Proof before press.** Galley coordinates a governed loop—produce, verify, proof, schedule, report—without removing the human owner from consequential decisions.

## Problem

Content teams do not need another blank-page generator. They need a reliable operating layer between a client playbook and the moment content is cleared to publish. Today, requirements live across briefs, chats, and memory; review quality varies; and approvals leave little usable evidence.

## V1 objective

Prove the validation node of the workflow. A user can establish a client playbook, receive a draft placeholder, inspect verifier findings, make a human proof decision, and understand that every decision belongs to an append-only record.

## Primary users

- Agency account and content managers overseeing several client accounts.
- DTC content leads protecting claims, voice, and channel standards.
- Reviewers accountable for the final publish decision.

## Core jobs

1. Capture the operating constraints for a client in a reusable playbook.
2. Bring a draft and verifier evidence into one proof surface.
3. Make approve, edit, or reject decisions explicit and attributable.
4. Preserve the sequence of inputs, checks, notes, and decisions as a record.

## V1 scope

### Client playbook setup

Capture client account name, website, industry, audience, primary offer, channels, brand voice, approved claims, forbidden claims, competitor URLs, and reporting KPI.

### Draft placeholder

Represent a generated deliverable with client, type, excerpt, channel, and version. Real generation is out of scope.

### Verifier placeholder

Show a deterministic pass, warning, or blocked result with plain-language notes tied to playbook constraints. Real automated verification is out of scope.

### Human proof queue

Reviewers can inspect evidence and choose approve, edit, or reject. Prototype actions may remain local and non-persistent, but the interface must communicate ownership and consequence.

### Append-only record

Expose a record entry point and model the record as immutable events. V1 may use mock events; later services must append corrections rather than mutate prior entries.

## Product loop

Produce → Verify → Proof → Schedule → Report

V1 makes Produce, Verify, and Proof legible. Schedule and Report appear only as downstream context and are not implemented as workflows.

## Success criteria

- A new visitor can explain Galley’s supervised model after reading the hero and trust layer.
- A user can complete a client playbook without SEO-specific setup language.
- A reviewer can identify what needs attention, why, and who owns the next decision.
- A proof decision never appears to publish content automatically.
- The interface contains no unsupported performance or productivity claims.

## Non-goals

- Live AI generation or verifier execution.
- Scheduling or publishing integrations.
- Performance reporting automation.
- A second workflow builder or autonomous mode.
- Pricing optimization, gamification, or vanity analytics.

## Guardrails

- Humans remain the publication gate.
- Verifier notes state evidence, not confidence theater.
- Status language describes observable workflow state.
- Claims about capacity remain qualitative until measured with customer data.


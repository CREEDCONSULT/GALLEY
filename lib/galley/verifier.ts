// Galley deterministic verifier v0 (Phase 2 rules engine, first slice).
//
// Pure and dependency-free: callable from Next.js server code, Convex
// mutations, and validation scripts. Every finding cites the playbook
// constraint it maps to — evidence, not confidence theater.

export const RUBRIC_VERSION = "galley-rules-v0.2";

export type VerifierSeverity = "block" | "warn" | "note";

export interface VerifierFinding {
  rule: string;
  severity: VerifierSeverity;
  evidence: string;
  constraint: string;
}

export interface VerifierReport {
  result: "pass" | "fail";
  rubricVersion: string;
  findings: VerifierFinding[];
  /** Human-readable summaries, compatible with `verifications.reasons`. */
  reasons: string[];
}

export interface VerifiablePlaybook {
  version: number;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
  channels: string[];
}

export interface VerifiableDraft {
  content: string;
  channel: string;
}

// Absolutist marketing language that invites substantiation problems even when
// a playbook does not forbid it explicitly. Warn-only: humans decide.
const RISK_LEXICON = [
  "guaranteed",
  "risk-free",
  "miracle",
  "clinically proven",
  "100% effective",
  "#1",
  "cure",
  "cures",
  "instant results",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[-–—/]/g, " ")
    .replace(/[^a-z0-9' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build a matcher for a claim phrase that tolerates case, punctuation,
 * hyphenation, flexible whitespace, and simple plural forms of each word.
 */
function claimPattern(claim: string): RegExp | null {
  const tokens = normalize(claim).split(" ").filter(Boolean);
  if (tokens.length === 0) return null;
  const body = tokens
    .map((token) => {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Allow simple plural/singular drift: claim "guarantee" catches
      // "guarantees"; claim "results" catches "result".
      const stem = escaped.replace(/s$/, "");
      return `${stem.length >= 3 ? stem : escaped}(?:s|es)?`;
    })
    .join("\\s+");
  return new RegExp(`(?:^|\\s)${body}(?:\\s|$)`);
}

function findPhrase(content: string, phrase: string): boolean {
  const pattern = claimPattern(phrase);
  return pattern !== null && pattern.test(` ${normalize(content)} `);
}

export function verifyDraft(
  draft: VerifiableDraft,
  playbook: VerifiablePlaybook,
): VerifierReport {
  const findings: VerifierFinding[] = [];
  const content = draft.content ?? "";

  // Rule 1 — substance: an empty or trivial draft cannot be proofed.
  if (normalize(content).length < 40) {
    findings.push({
      rule: "draft.too_short",
      severity: "block",
      evidence: `Draft body is ${content.trim().length} characters.`,
      constraint: "Drafts must contain reviewable substance before entering the proof queue.",
    });
  }

  // Rule 2 — forbidden claims from the playbook (the compliance core).
  for (const claim of playbook.forbiddenClaims) {
    if (findPhrase(content, claim)) {
      findings.push({
        rule: "claims.forbidden",
        severity: "block",
        evidence: `Contains forbidden claim: "${claim}".`,
        constraint: `Playbook v${playbook.version} forbids the claim "${claim}".`,
      });
    }
  }

  // Rule 3 — channel must be approved by the playbook.
  const channelApproved = playbook.channels.some(
    (channel) => normalize(channel) === normalize(draft.channel),
  );
  if (!channelApproved) {
    findings.push({
      rule: "channel.not_in_playbook",
      severity: "block",
      evidence: `Draft targets channel "${draft.channel}".`,
      constraint: `Playbook v${playbook.version} approves: ${playbook.channels.join(", ")}.`,
    });
  }

  // Rule 4 — substantiation-risk language (warn only; humans decide).
  const forbiddenNormalized = playbook.forbiddenClaims.map(normalize);
  for (const term of RISK_LEXICON) {
    if (forbiddenNormalized.includes(normalize(term))) continue; // already blocked above
    if (findPhrase(content, term)) {
      findings.push({
        rule: "claims.substantiation_risk",
        severity: "warn",
        evidence: `Contains high-risk phrase: "${term}".`,
        constraint: "Absolute claims require substantiation on file (FTC Endorsement Guides).",
      });
    }
  }

  // Rule 5 — note which approved claims are present (supporting evidence).
  const presentApproved = playbook.approvedClaims.filter((claim) =>
    findPhrase(content, claim),
  );
  if (presentApproved.length > 0) {
    findings.push({
      rule: "claims.approved_present",
      severity: "note",
      evidence: `Uses approved claims: ${presentApproved.map((c) => `"${c}"`).join(", ")}.`,
      constraint: `Playbook v${playbook.version} approved-claims list.`,
    });
  }

  const blocked = findings.filter((finding) => finding.severity === "block");
  const warned = findings.filter((finding) => finding.severity === "warn");
  const result: VerifierReport["result"] = blocked.length > 0 ? "fail" : "pass";

  const reasons =
    result === "fail"
      ? blocked.map((finding) => finding.evidence)
      : [
          `No forbidden claims found (${playbook.forbiddenClaims.length} playbook rules checked).`,
          `Channel "${draft.channel}" is approved in playbook v${playbook.version}.`,
          ...warned.map((finding) => `Review: ${finding.evidence}`),
          ...findings
            .filter((finding) => finding.severity === "note")
            .map((finding) => finding.evidence),
        ];

  return { result, rubricVersion: RUBRIC_VERSION, findings, reasons };
}

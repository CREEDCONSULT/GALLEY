import type { VerifierFinding } from "./verifier";

// Pure, dependency-free helpers for the LLM-graded verification layer. The
// network call lives in convex/verifierLlm.ts; everything here is testable
// without an API key. The LLM layer closes the paraphrase / voice gap the
// deterministic rules engine cannot catch (see lib/galley/eval/goldenSet.ts).

export const LLM_RUBRIC_VERSION = "galley-llm-v0.1";
export const LLM_MODEL = "claude-haiku-4-5-20251001";

export interface LlmVerifiableInput {
  content: string;
  channel: string;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
}

const SYSTEM_PROMPT = `You are Galley's content compliance checker. You judge a marketing draft against a client's brand playbook and report only concrete, evidence-backed violations. You never invent rules that are not in the playbook. You are strict about claims and honest about uncertainty.`;

/**
 * Build the messages payload for the Anthropic Messages API. Asks for a strict
 * JSON object so the response is machine-parseable.
 */
export function buildVerificationPrompt(input: LlmVerifiableInput): {
  system: string;
  user: string;
} {
  const user = [
    "Check this draft against the playbook. Report two kinds of violation ONLY:",
    "1. claims.forbidden_paraphrase — the draft expresses the meaning of a forbidden claim even if it does not use the exact words. Severity: block.",
    "2. voice.mismatch — the draft clearly violates the brand voice rule. Severity: warn.",
    "",
    "Do not report anything else. If the draft is compliant, return an empty findings array.",
    "",
    "PLAYBOOK",
    `Voice: ${input.voice}`,
    `Approved claims: ${input.approvedClaims.join("; ") || "(none)"}`,
    `Forbidden claims: ${input.forbiddenClaims.join("; ") || "(none)"}`,
    `Channel: ${input.channel}`,
    "",
    "DRAFT",
    input.content,
    "",
    'Respond with ONLY a JSON object of this exact shape, no prose, no code fences:',
    '{"findings":[{"rule":"claims.forbidden_paraphrase","severity":"block","evidence":"<quote or paraphrase from the draft>","constraint":"<the playbook rule it violates>"}]}',
  ].join("\n");

  return { system: SYSTEM_PROMPT, user };
}

const ALLOWED_RULES = new Set(["claims.forbidden_paraphrase", "voice.mismatch"]);
const ALLOWED_SEVERITIES = new Set(["block", "warn"]);

/**
 * Parse the model's text into validated findings. Tolerant of code fences and
 * surrounding whitespace. Returns null when the text cannot be parsed into the
 * expected shape, so the caller can treat the LLM pass as unavailable rather
 * than trusting garbage.
 */
export function parseVerificationResponse(text: string): VerifierFinding[] | null {
  const jsonText = extractJson(text);
  if (!jsonText) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || !Array.isArray((parsed as { findings?: unknown }).findings)) {
    return null;
  }
  const raw = (parsed as { findings: unknown[] }).findings;
  const findings: VerifierFinding[] = [];
  for (const item of raw) {
    if (typeof item !== "object" || item === null) continue;
    const f = item as Record<string, unknown>;
    if (
      typeof f.rule !== "string" ||
      typeof f.severity !== "string" ||
      typeof f.evidence !== "string" ||
      typeof f.constraint !== "string" ||
      !ALLOWED_RULES.has(f.rule) ||
      !ALLOWED_SEVERITIES.has(f.severity)
    ) {
      continue;
    }
    findings.push({
      rule: f.rule,
      severity: f.severity as VerifierFinding["severity"],
      evidence: f.evidence,
      constraint: f.constraint,
    });
  }
  return findings;
}

function extractJson(text: string): string | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced ? fenced[1] : text).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  return body.slice(start, end + 1);
}

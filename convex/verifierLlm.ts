import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { VerifierFinding } from "../lib/galley/verifier";
import {
  LLM_MODEL,
  LLM_RUBRIC_VERSION,
  buildVerificationPrompt,
  parseVerificationResponse,
} from "../lib/galley/llmVerifier";

// LLM-graded verification pass (Phase 2). Closes the paraphrase / voice gap the
// deterministic rules engine cannot catch. Runs in a Convex action because it
// makes an external API call — mutations/queries cannot.
//
// Graceful degradation: with no ANTHROPIC_API_KEY set on the deployment, the
// check returns { active: false } and the loop proceeds on deterministic
// results alone. Activate with `npx convex env set ANTHROPIC_API_KEY sk-...`.

interface LlmCheckResult {
  active: boolean;
  rubricVersion: string;
  model?: string;
  findings: VerifierFinding[];
  note?: string;
  error?: string;
}

/** Core LLM check. Pure of Convex context so both the public action and the
 * scheduled second pass share exactly one code path. */
async function performLlmCheck(args: {
  content: string;
  channel: string;
  voice: string;
  approvedClaims: string[];
  forbiddenClaims: string[];
}): Promise<LlmCheckResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      active: false,
      rubricVersion: LLM_RUBRIC_VERSION,
      findings: [],
      note: "ANTHROPIC_API_KEY is not set; LLM verification is inactive.",
    };
  }

  const { system, user } = buildVerificationPrompt(args);
  let text: string;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!response.ok) {
      return {
        active: true,
        rubricVersion: LLM_RUBRIC_VERSION,
        findings: [],
        error: `Anthropic API returned ${response.status}.`,
      };
    }
    const data = (await response.json()) as { content?: Array<{ text?: string }> };
    text = data.content?.map((block) => block.text ?? "").join("") ?? "";
  } catch (error) {
    return {
      active: true,
      rubricVersion: LLM_RUBRIC_VERSION,
      findings: [],
      error: error instanceof Error ? error.message : "LLM request failed.",
    };
  }

  const findings = parseVerificationResponse(text);
  if (findings === null) {
    return {
      active: true,
      rubricVersion: LLM_RUBRIC_VERSION,
      findings: [],
      error: "Could not parse the model response into findings.",
    };
  }
  return { active: true, rubricVersion: LLM_RUBRIC_VERSION, model: LLM_MODEL, findings };
}

/** Public action — used by the eval/measurement script and ad-hoc checks. */
export const llmVerifyDraft = action({
  args: {
    content: v.string(),
    channel: v.string(),
    voice: v.string(),
    approvedClaims: v.array(v.string()),
    forbiddenClaims: v.array(v.string()),
  },
  handler: async (_ctx, args) => performLlmCheck(args),
});

/**
 * Scheduled second pass over a deliverable's latest draft. Runs after the
 * deterministic verification commits; if the LLM finds a forbidden-claim
 * paraphrase, it escalates the deliverable out of the proof queue for a human.
 * No-ops safely when the API key is absent.
 */
export const runLlmPass = internalAction({
  args: { deliverableId: v.id("deliverables") },
  handler: async (ctx, args) => {
    const input = await ctx.runQuery(internal.galley.getVerificationInput, {
      deliverableId: args.deliverableId,
    });
    if (!input) return { ran: false };
    const result = await performLlmCheck({
      content: input.content,
      channel: input.channel,
      voice: input.voice,
      approvedClaims: input.approvedClaims,
      forbiddenClaims: input.forbiddenClaims,
    });
    if (!result.active) return { ran: false };
    await ctx.runMutation(internal.galley.applyLlmVerification, {
      deliverableId: args.deliverableId,
      draftId: input.draftId,
      findings: result.findings,
      rubricVersion: result.rubricVersion,
      model: result.model ?? "unknown",
    });
    return { ran: true, findings: result.findings.length };
  },
});

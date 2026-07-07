import { action } from "./_generated/server";
import { v } from "convex/values";
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
// Graceful degradation: with no ANTHROPIC_API_KEY set on the deployment, this
// returns { active: false } and the loop proceeds on deterministic results
// alone. Set the key with `npx convex env set ANTHROPIC_API_KEY sk-...` to
// activate it. Nothing here is wired into the write path yet — it is a callable
// second-pass surface pending the key and a UX decision on timing.

export const llmVerifyDraft = action({
  args: {
    content: v.string(),
    channel: v.string(),
    voice: v.string(),
    approvedClaims: v.array(v.string()),
    forbiddenClaims: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        active: false as const,
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
          active: true as const,
          rubricVersion: LLM_RUBRIC_VERSION,
          findings: [],
          error: `Anthropic API returned ${response.status}.`,
        };
      }
      const data = (await response.json()) as { content?: Array<{ text?: string }> };
      text = data.content?.map((block) => block.text ?? "").join("") ?? "";
    } catch (error) {
      return {
        active: true as const,
        rubricVersion: LLM_RUBRIC_VERSION,
        findings: [],
        error: error instanceof Error ? error.message : "LLM request failed.",
      };
    }

    const findings = parseVerificationResponse(text);
    if (findings === null) {
      return {
        active: true as const,
        rubricVersion: LLM_RUBRIC_VERSION,
        findings: [],
        error: "Could not parse the model response into findings.",
      };
    }
    return {
      active: true as const,
      rubricVersion: LLM_RUBRIC_VERSION,
      model: LLM_MODEL,
      findings,
    };
  },
});

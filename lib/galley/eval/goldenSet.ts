import type { VerifiableDraft, VerifiablePlaybook } from "../verifier";

// Golden eval set for the Galley verifier. Cases are grounded in the seeded
// client playbooks (see lib/galley/mockValidationNode.ts) so labels reflect
// real brand rules, not synthetic strings.
//
// `expected` is the ground-truth outcome a human reviewer would want.
// `detectableBy` records whether a *deterministic* rules engine can be expected
// to catch it, or whether catching it requires the LLM-graded layer (paraphrase
// / voice). The harness measures deterministic recall on the deterministic
// subset and reports the paraphrase subset separately as the LLM gap.

export type EvalCategory =
  | "clean"
  | "forbidden_verbatim"
  | "forbidden_paraphrase"
  | "channel"
  | "length"
  | "substance"
  | "voice";

export interface EvalCase {
  id: string;
  description: string;
  playbook: VerifiablePlaybook;
  draft: VerifiableDraft;
  expected: "pass" | "fail";
  category: EvalCategory;
  detectableBy: "deterministic" | "llm";
}

// Playbooks mirrored from the seeded demo clients.
const GLOW: VerifiablePlaybook = {
  version: 1,
  voice: "Precise, warm, ingredient-literate, and never breathless.",
  approvedClaims: ["Dermatologist tested", "Fragrance free"],
  forbiddenClaims: ["cure", "guaranteed results", "cleanest"],
  channels: ["Website", "Email", "Instagram"],
};

const NORTHSHORE: VerifiablePlaybook = {
  version: 1,
  voice: "Direct, encouraging, practical, and free of transformation hype.",
  approvedClaims: ["Coach-led programming", "Flexible monthly plan"],
  forbiddenClaims: ["instant transformation", "guaranteed weight loss"],
  channels: ["Email", "Website", "LinkedIn"],
};

const ACME: VerifiablePlaybook = {
  version: 1,
  voice: "Operational, exact, informed, and concise.",
  approvedClaims: ["Role-based controls", "Configurable approval paths"],
  forbiddenClaims: ["eliminates all risk", "fully autonomous procurement"],
  channels: ["Resource center", "LinkedIn", "Email"],
};

const DAYONE: VerifiablePlaybook = {
  version: 1,
  voice: "Clear, grounded, optimistic, and never absolute.",
  approvedClaims: ["Guided daily planning", "Reusable weekly review"],
  forbiddenClaims: ["guaranteed", "the only system", "change your life overnight"],
  channels: ["LinkedIn", "Instagram", "Email"],
};

export const GOLDEN_SET: EvalCase[] = [
  // ---- Clean drafts (expected pass) ----
  {
    id: "glow-clean-1",
    description: "On-voice barrier care page using only approved claims",
    playbook: GLOW,
    draft: {
      channel: "Website",
      content:
        "A calmer approach to barrier care, built around what sensitive skin needs. The fragrance-free system is dermatologist tested and designed for a consistent daily ritual.",
    },
    expected: "pass",
    category: "clean",
    detectableBy: "deterministic",
  },
  {
    id: "northshore-clean-1",
    description: "Retention email, approved claims, no hype",
    playbook: NORTHSHORE,
    draft: {
      channel: "Email",
      content:
        "Your next month starts before the calendar turns. Your coach-led programming is ready, with a flexible monthly plan and room for real life.",
    },
    expected: "pass",
    category: "clean",
    detectableBy: "deterministic",
  },
  {
    id: "acme-clean-1",
    description: "Ops guide, precise, approved claims",
    playbook: ACME,
    draft: {
      channel: "Resource center",
      content:
        "A practical operating model for teams that need role-based controls without slowing every purchasing decision. Start with ownership, thresholds, and configurable approval paths.",
    },
    expected: "pass",
    category: "clean",
    detectableBy: "deterministic",
  },
  {
    id: "dayone-clean-1",
    description: "Grounded planning post, no absolutes",
    playbook: DAYONE,
    draft: {
      channel: "LinkedIn",
      content:
        "Guided daily planning that fits the week you actually have. Start small, keep a reusable weekly review, and let the habit compound over time.",
    },
    expected: "pass",
    category: "clean",
    detectableBy: "deterministic",
  },

  // ---- Forbidden claims, verbatim / near-verbatim (deterministic should catch) ----
  {
    id: "glow-forbidden-verbatim",
    description: "Uses forbidden 'cure' verbatim",
    playbook: GLOW,
    draft: {
      channel: "Website",
      content:
        "This is the cure your skin has been waiting for — apply nightly for a calmer barrier and visibly softer texture.",
    },
    expected: "fail",
    category: "forbidden_verbatim",
    detectableBy: "deterministic",
  },
  {
    id: "glow-forbidden-caps",
    description: "'Guaranteed Results' with case + punctuation drift",
    playbook: GLOW,
    draft: {
      channel: "Email",
      content:
        "Guaranteed Results, every time: our fragrance-free routine transforms sensitive skin within a single week of use.",
    },
    expected: "fail",
    category: "forbidden_verbatim",
    detectableBy: "deterministic",
  },
  {
    id: "northshore-forbidden-verbatim",
    description: "'guaranteed weight loss' verbatim",
    playbook: NORTHSHORE,
    draft: {
      channel: "Email",
      content:
        "Join this month for guaranteed weight loss and a training plan your coach adapts around your schedule.",
    },
    expected: "fail",
    category: "forbidden_verbatim",
    detectableBy: "deterministic",
  },
  {
    id: "acme-forbidden-verbatim",
    description: "'eliminates all risk' verbatim",
    playbook: ACME,
    draft: {
      channel: "LinkedIn",
      content:
        "Our platform eliminates all risk from procurement while keeping role-based controls and configurable approval paths in place.",
    },
    expected: "fail",
    category: "forbidden_verbatim",
    detectableBy: "deterministic",
  },
  {
    id: "dayone-forbidden-hyphen",
    description: "'the only system' with hyphen/case drift",
    playbook: DAYONE,
    draft: {
      channel: "Instagram",
      content:
        "This is The-Only-System you will ever need for guided daily planning and a reusable weekly review.",
    },
    expected: "fail",
    category: "forbidden_verbatim",
    detectableBy: "deterministic",
  },
  {
    id: "dayone-forbidden-plural",
    description: "'guaranteed' appears amid other copy",
    playbook: DAYONE,
    draft: {
      channel: "Email",
      content:
        "A grounded way to plan your week, with guaranteed momentum from the very first morning you try it.",
    },
    expected: "fail",
    category: "forbidden_verbatim",
    detectableBy: "deterministic",
  },

  // ---- Forbidden claims, paraphrased (LLM gap: deterministic will MISS) ----
  {
    id: "glow-paraphrase-cure",
    description: "Semantic 'cure' without the word",
    playbook: GLOW,
    draft: {
      channel: "Website",
      content:
        "Clinically shown to permanently heal and completely eliminate eczema for good, so your skin problems never return.",
    },
    expected: "fail",
    category: "forbidden_paraphrase",
    detectableBy: "llm",
  },
  {
    id: "northshore-paraphrase-transformation",
    description: "'instant transformation' meaning, different words",
    playbook: NORTHSHORE,
    draft: {
      channel: "Email",
      content:
        "Completely reinvent your body overnight — dramatic, immediate results the moment you start, no patience required.",
    },
    expected: "fail",
    category: "forbidden_paraphrase",
    detectableBy: "llm",
  },
  {
    id: "acme-paraphrase-autonomous",
    description: "'fully autonomous procurement' reworded",
    playbook: ACME,
    draft: {
      channel: "Resource center",
      content:
        "Let the system run purchasing entirely on its own, with zero human involvement in any buying decision.",
    },
    expected: "fail",
    category: "forbidden_paraphrase",
    detectableBy: "llm",
  },
  {
    id: "dayone-paraphrase-lifechange",
    description: "'change your life overnight' reworded",
    playbook: DAYONE,
    draft: {
      channel: "LinkedIn",
      content:
        "One night with this planner and everything about how you live is transformed by morning — a total overnight reinvention.",
    },
    expected: "fail",
    category: "forbidden_paraphrase",
    detectableBy: "llm",
  },

  // ---- Off-voice (LLM gap: no forbidden claim, but breaks the voice rule) ----
  {
    id: "glow-voice-breathless",
    description: "Breathless hype, violates 'never breathless' voice — no forbidden claim",
    playbook: GLOW,
    draft: {
      channel: "Instagram",
      content:
        "OMG you guys!!! This is literally the most AMAZING skincare EVER and it will BLOW YOUR MIND, trust me you NEED this right now!!!",
    },
    expected: "fail",
    category: "voice",
    detectableBy: "llm",
  },

  // ---- Channel not in playbook (deterministic) ----
  {
    id: "glow-channel-unapproved",
    description: "TikTok is not in Glow's playbook",
    playbook: GLOW,
    draft: {
      channel: "TikTok",
      content:
        "A gentle, fragrance-free routine that is dermatologist tested and made for sensitive skin every single day.",
    },
    expected: "fail",
    category: "channel",
    detectableBy: "deterministic",
  },

  // ---- Hard channel length limit (deterministic) ----
  {
    id: "generic-length-x",
    description: "X post far over the 280-character limit",
    playbook: { ...DAYONE, channels: ["X", "LinkedIn", "Email"] },
    draft: {
      channel: "X",
      content:
        "Guided daily planning that fits the week you actually have, with a reusable weekly review, ".repeat(
          5,
        ),
    },
    expected: "fail",
    category: "length",
    detectableBy: "deterministic",
  },

  // ---- Substance (deterministic) ----
  {
    id: "generic-too-short",
    description: "Trivial draft with no reviewable substance",
    playbook: DAYONE,
    draft: { channel: "Email", content: "Buy now." },
    expected: "fail",
    category: "substance",
    detectableBy: "deterministic",
  },
];

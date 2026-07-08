import { Check, CircleAlert, Clock3, ScanLine, Sparkles } from "lucide-react";
import type { Verification } from "@/lib/galley/types";

// Renders Galley's two-layer verification evidence: the deterministic rules
// check, then the LLM-graded second pass. Evidence-forward per DESIGN.md — each
// layer states its result and the first line of cited evidence.

function ResultRow({
  icon,
  label,
  verification,
  pendingLabel,
}: {
  icon: React.ReactNode;
  label: string;
  verification: Verification | null;
  pendingLabel: string;
}) {
  const result = verification?.result ?? null;
  const tone =
    result === "pass" ? "text-success" : result === "fail" ? "text-danger" : "text-slate";
  const word =
    result === "pass" ? "Passed" : result === "fail" ? "Flagged" : pendingLabel;
  const statusIcon =
    result === "pass" ? <Check size={12} /> : result === "fail" ? <CircleAlert size={12} /> : <Clock3 size={12} />;

  return (
    <div>
      <p className="flex items-center gap-2 text-[11px] font-medium">
        <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-slate">
          {icon} {label}
        </span>
        <span className={`ml-auto inline-flex items-center gap-1 ${tone}`}>{statusIcon} {word}</span>
      </p>
      <ul className="mt-1 space-y-0.5 text-[11px] leading-4 text-slate">
        {(verification?.reasons ?? [pendingLabel === "Pending" ? "Runs after the rules check." : "—"])
          .slice(0, result === "fail" ? 2 : 1)
          .map((reason) => (
            <li key={reason}>— {reason}</li>
          ))}
      </ul>
    </div>
  );
}

export function VerificationLayers({
  deterministic,
  llm,
}: {
  deterministic: Verification | null;
  llm: Verification | null;
}) {
  return (
    <div className="space-y-2.5">
      <ResultRow
        icon={<ScanLine size={11} />}
        label="Rules check"
        verification={deterministic}
        pendingLabel="Pending"
      />
      <div className="border-t border-border/60" />
      <ResultRow
        icon={<Sparkles size={11} />}
        label="AI review"
        verification={llm}
        pendingLabel="Pending"
      />
    </div>
  );
}

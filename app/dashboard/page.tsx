import Link from "next/link";
import { ArrowRight, Check, CircleAlert, ClipboardCheck, FileClock } from "lucide-react";

const stages = [
  { label: "Produce", state: "Placeholder" },
  { label: "Verify", state: "3 complete" },
  { label: "Proof", state: "3 awaiting", active: true },
  { label: "Schedule", state: "Not connected" },
  { label: "Report", state: "Not connected" },
];

const recent = [
  { client: "Aster House", type: "Landing page", finding: "One source needs review", result: "Warning" },
  { client: "Northline Coffee", type: "Email", finding: "No verifier blocks", result: "Pass" },
  { client: "Fieldnote", type: "Paid social", finding: "Forbidden comparison found", result: "Blocked" },
];

export default function DashboardOverview() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Validation desk</p>
          <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Good morning, Oliver.</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted">Three deliverables are waiting for a human decision. Verifier evidence is ready beside each draft.</p>
        </div>
        <Link href="/dashboard/proof" className="group inline-flex items-center justify-center gap-3 bg-primary px-5 py-3.5 text-sm font-semibold text-background hover:bg-primary-strong">
          Open proof queue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <section className="py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Current run</p>
            <h2 className="mt-2 text-xl font-semibold">Monday client batch</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate">Run / 2026-06-29-01</span>
        </div>
        <ol className="mt-6 grid border-l border-t border-border sm:grid-cols-5">
          {stages.map((stage, index) => (
            <li key={stage.label} className={`relative border-b border-r border-border p-5 ${stage.active ? "bg-surface-raised" : "bg-surface/30"}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-slate">0{index + 1}</span>
                {index < 2 && <Check size={13} className="text-success" />}
              </div>
              <p className="mt-8 font-semibold">{stage.label}</p>
              <p className={`mt-1 font-mono text-[9px] uppercase tracking-wider ${stage.active ? "text-primary" : "text-slate"}`}>{stage.state}</p>
              {stage.active && <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-6 border-t border-border pt-8 lg:grid-cols-[1.4fr_0.6fr]">
        <section>
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">At the gate</p>
              <h2 className="mt-2 text-xl font-semibold">Verifier summary</h2>
            </div>
            <Link href="/dashboard/proof" className="text-sm font-medium text-primary hover:text-primary-strong">Review all</Link>
          </div>
          <div className="mt-5 border border-border bg-surface">
            {recent.map((item) => (
              <Link href="/dashboard/proof" key={`${item.client}-${item.type}`} className="grid gap-3 border-b border-border p-5 transition-colors last:border-0 hover:bg-surface-raised sm:grid-cols-[1fr_0.75fr_1.25fr_auto] sm:items-center">
                <div>
                  <p className="font-medium">{item.client}</p>
                  <p className="mt-1 text-xs text-slate">{item.type}</p>
                </div>
                <span className={`w-fit border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${item.result === "Pass" ? "border-success/30 text-success" : item.result === "Warning" ? "border-warning/30 text-warning" : "border-danger/30 text-danger"}`}>{item.result}</span>
                <p className="text-sm text-muted">{item.finding}</p>
                <ArrowRight size={15} className="text-slate" />
              </Link>
            ))}
          </div>
        </section>

        <aside className="border border-border bg-[#0d0d0c] p-6">
          <ClipboardCheck size={20} className="text-primary" />
          <h2 className="mt-8 text-xl font-semibold">The proof gate is explicit.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Approval clears a specific version for a future scheduling step. It does not publish the deliverable.</p>
          <div className="mt-7 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex items-center gap-3 text-ink-soft"><CircleAlert size={15} className="text-warning" /> 2 items need attention</div>
            <div className="flex items-center gap-3 text-ink-soft"><FileClock size={15} className="text-slate" /> Every action enters the record</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

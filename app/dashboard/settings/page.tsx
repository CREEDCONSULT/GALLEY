import { Fingerprint, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";

const controls = [
  {
    title: "Human approval gate",
    description: "Every deliverable requires a recorded reviewer decision before it can move to a future scheduling stage.",
    state: "Required",
    icon: UserCheck,
  },
  {
    title: "Client playbook isolation",
    description: "Voice, claims, exclusions, and channel rules remain scoped to the selected client account.",
    state: "Active",
    icon: LockKeyhole,
  },
  {
    title: "Append-only records",
    description: "Prototype events model an immutable chain of custody. Persistent audit storage is deferred from Phase 1.",
    state: "Prototype",
    icon: Fingerprint,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Workspace controls</p>
        <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Settings</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">The operating boundaries for this Galley workspace. Publishing integrations and scheduling controls are intentionally outside Phase 1.</p>
      </header>

      <section className="mt-8 border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="font-semibold">Northline Studio</p>
            <p className="mt-1 text-xs text-slate">Agency workspace · Prototype environment</p>
          </div>
          <span className="flex items-center gap-2 border border-success/35 bg-success/5 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-success"><ShieldCheck size={13} /> Guardrails active</span>
        </div>

        {controls.map((control) => (
          <article key={control.title} className="grid gap-5 border-b border-border px-6 py-6 last:border-0 md:grid-cols-[auto_1fr_auto] md:items-center">
            <span className="flex h-10 w-10 items-center justify-center border border-border-strong text-primary"><control.icon size={18} /></span>
            <div>
              <h2 className="font-semibold text-ink-soft">{control.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{control.description}</p>
            </div>
            <span className="w-fit border border-border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-slate">{control.state}</span>
          </article>
        ))}
      </section>
    </div>
  );
}

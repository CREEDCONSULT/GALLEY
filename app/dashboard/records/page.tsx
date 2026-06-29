import { CalendarCheck, Check, FileText, Fingerprint, Send, ShieldCheck, UserCheck } from "lucide-react";

const events = [
  {
    time: "09:41",
    kind: "Source",
    title: "Playbook selected",
    detail: "Voice, claims, exclusions, and website channel rules locked for this run.",
    actor: "System",
    icon: FileText,
  },
  {
    time: "09:42",
    kind: "Draft",
    title: "Draft generated",
    detail: "Landing page draft created against playbook v3.",
    actor: "Galley draft placeholder",
    icon: FileText,
  },
  {
    time: "09:43",
    kind: "Check",
    title: "Verification passed",
    detail: "Voice, claims, exclusions, and website channel rules passed verification.",
    actor: "Galley verifier placeholder",
    icon: ShieldCheck,
  },
  {
    time: "10:06",
    kind: "Edit",
    title: "Human edited",
    detail: "Reviewer clarified the durability sentence and attached the approved source note.",
    actor: "Oliver Grant",
    icon: UserCheck,
  },
  {
    time: "10:08",
    kind: "Decision",
    title: "Approved",
    detail: "Draft v2 received a recorded human approval.",
    actor: "Oliver Grant",
    icon: Check,
    approved: true,
  },
  {
    time: "13:00",
    kind: "Routing",
    title: "Scheduled",
    detail: "Approved deliverable assigned to the website release window.",
    actor: "Schedule placeholder",
    icon: CalendarCheck,
  },
  {
    time: "08:00",
    kind: "Receipt",
    title: "Published",
    detail: "Publication receipt appended to the record.",
    actor: "Publish placeholder",
    icon: Send,
    approved: true,
  },
];

export default function RecordsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Chain of custody</p>
        <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Records</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">Every draft, check, edit, and approval stays attached to the deliverable. New events append to the history; prior events remain intact.</p>
      </header>

      <section aria-label="Record custody summary" className="mt-8 grid grid-cols-2 border-l border-t border-border lg:grid-cols-4">
        {[
          { label: "Source", value: "Playbook v3" },
          { label: "Check", value: "Verifier passed" },
          { label: "Decision", value: "Oliver Grant" },
          { label: "Destination", value: "Website" },
        ].map((item) => (
          <div key={item.label} className="border-b border-r border-border bg-surface/40 p-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate">{item.label}</p>
            <p className="mt-2 text-sm font-medium text-ink-soft">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
        <aside className="h-fit border border-border bg-surface p-6">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <Fingerprint size={20} className="text-primary" />
            <span className="border border-status-published/35 bg-status-published/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-status-published">Published</span>
          </div>
          <p className="mt-6 font-mono text-[9px] uppercase tracking-wider text-slate">GLY-0142-R02</p>
          <h2 className="mt-2 text-xl font-semibold">Aster House</h2>
          <p className="mt-1 text-sm text-muted">Spring collection landing page</p>
          <dl className="mt-7 space-y-4 border-t border-border pt-5 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate">Version</dt><dd className="text-ink-soft">Draft v2</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Playbook</dt><dd className="text-ink-soft">v3</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Channel</dt><dd className="text-ink-soft">Website</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate">Owner</dt><dd className="text-ink-soft">Oliver Grant</dd></div>
          </dl>
          <div className="mt-6 flex gap-3 border border-primary/30 bg-primary/5 p-4 text-xs leading-5 text-ink-soft">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
            Prototype record. Events are static and do not yet persist to the audit store.
          </div>
        </aside>

        <section className="border border-border bg-[#0d0d0c] p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div><p className="eyebrow">Event timeline</p><h2 className="mt-2 text-lg font-semibold">{events.length} recorded events</h2></div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-slate">29 Jun 2026</span>
          </div>
          <ol className="mt-7">
            {events.map((event, index) => (
              <li key={event.title} className="grid grid-cols-[3rem_1.5rem_1fr] gap-3">
                <span className="pt-1 font-mono text-[9px] text-slate">{event.time}</span>
                <span className="flex flex-col items-center">
                  <span className={`flex h-6 w-6 items-center justify-center border ${event.approved ? "border-success bg-success/10 text-success" : "border-border-strong text-primary"}`}><event.icon size={12} /></span>
                  {index < events.length - 1 && <span className="min-h-18 w-px flex-1 bg-border" />}
                </span>
                <div className="pb-7">
                  <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.14em] text-primary">{event.kind}</p>
                  <h3 className="text-sm font-semibold text-ink-soft">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{event.detail}</p>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-slate">Actor · {event.actor}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

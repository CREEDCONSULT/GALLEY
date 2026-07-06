import Link from "next/link";
import { CircleAlert, FileText, Fingerprint, ShieldCheck, UserCheck } from "lucide-react";
import { getQueueDetails, isBackendConfigured, listEventsForDeliverable } from "@/lib/galley/convexData";
import type { Event } from "@/lib/galley/types";

export const dynamic = "force-dynamic";
function title(type: string) { return type.split(".").map((part) => part.charAt(0).toUpperCase() + part.slice(1).replaceAll("_", " ")).join(" · "); }
function summary(event: Event) {
  if (event.type === "playbook.selected") return `Playbook v${String(event.payload.playbookVersion ?? "—")} selected as the source of brand truth.`;
  if (event.type === "draft.generated") return `Draft v${String(event.payload.draftVersion ?? "—")} created and attached to this deliverable.`;
  if (event.type === "verification.passed") return "The verifier passed this version against its playbook.";
  if (event.type === "verification.failed") return String(Array.isArray(event.payload.reasons) ? event.payload.reasons[0] : "The verifier found a playbook violation.");
  if (event.type === "proof.awaiting") return "Verification completed; the draft entered the human gate.";
  if (event.type === "approval.approved") return "An authenticated reviewer approved this version. It was not published.";
  if (event.type === "approval.edited") return String(event.payload.editDiff ?? "A reviewer changed the draft and returned it to verification.");
  if (event.type === "approval.rejected") return String(event.payload.reason ?? "A reviewer stopped this deliverable.");
  if (event.type === "deliverable.status_changed") return `State changed from ${String(event.payload.from ?? "—")} to ${String(event.payload.to ?? "—")}.`;
  return "A lifecycle event was appended to the record.";
}
function Icon({ event }: { event: Event }) { if (event.type.includes("failed") || event.type.includes("rejected")) return <CircleAlert size={12}/>; if (event.actorType === "human") return <UserCheck size={12}/>; return <FileText size={12}/>; }

export default async function RecordsPage({ searchParams }: { searchParams: Promise<{ deliverable?: string }> }) {
  const configured = isBackendConfigured();
  let error = ""; let queue = [] as Awaited<ReturnType<typeof getQueueDetails>>;
  if (configured) try { queue = await getQueueDetails(); } catch (cause) { error = cause instanceof Error ? cause.message : "Unable to load records."; }
  const deliverables = queue.map((row) => row.deliverable);
  const requested = (await searchParams).deliverable;
  const selected = deliverables.find((item) => item.id === requested) ?? deliverables[0];
  const detail = selected ? queue.find((row) => row.deliverable.id === selected.id) ?? null : null;
  const events = selected ? await listEventsForDeliverable(selected.id) : [];
  const decision = [...events].reverse().find((event) => event.type.startsWith("approval."));

  return <div className="mx-auto max-w-6xl">
    <header className="border-b border-border pb-8"><p className="eyebrow">Append-only evidence</p><h1 className="editorial-display mt-4 text-5xl md:text-6xl">Records</h1><p className="mt-4 max-w-2xl leading-7 text-muted">The event log is the source of truth: who acted, what changed, and which version moved through the gate.</p></header>
    {(!configured || error) && <section className="mt-7 border border-warning/30 bg-warning/5 p-6"><h2 className="font-semibold">Persistence setup required</h2><p className="mt-2 text-sm text-muted">{error || "Connect the Convex backend to inspect chain-of-custody records."}</p></section>}
    {configured && !error && !selected && <section className="mt-7 border border-border bg-surface p-12 text-center"><Fingerprint className="mx-auto text-primary"/><h2 className="mt-4 font-semibold">No deliverable records yet.</h2><p className="mt-2 text-sm text-muted">Seed work from the Proof Queue to create an append-only trail.</p></section>}
    {selected && detail && <>
      <nav className="mt-7 flex gap-2 overflow-x-auto pb-1" aria-label="Deliverable records">{deliverables.map((item) => <Link key={item.id} href={`/dashboard/records?deliverable=${item.id}`} className={`min-w-48 shrink-0 border p-3 ${item.id === selected.id ? "border-primary bg-primary/5" : "border-border bg-surface/40"}`}><span className="block text-xs font-medium">{item.title}</span><span className="mt-1 block text-[11px] text-slate">{item.channel} · {item.status.replaceAll("_", " ")}</span></Link>)}</nav>
      <section className="mt-6 grid grid-cols-2 border-l border-t border-border lg:grid-cols-4">{[
        ["Source", `Playbook v${detail.playbook?.version ?? "—"}`], ["Check", detail.verification ? `Verifier ${detail.verification.result}` : "No result"], ["Decision", decision ? decision.type.replace("approval.", "") : "Awaiting human"], ["Destination", "Not scheduled"],
      ].map(([label,value]) => <div key={label} className="border-b border-r border-border bg-surface/40 p-4"><p className="font-mono text-[9px] uppercase tracking-wider text-slate">{label}</p><p className="mt-2 text-sm font-medium capitalize">{value}</p></div>)}</section>
      <div className="mt-6 grid gap-6 lg:grid-cols-[.68fr_1.32fr]"><aside className="h-fit border border-border bg-surface p-6"><div className="flex items-center justify-between border-b border-border pb-5"><Fingerprint size={20} className="text-primary"/><span className="border border-border px-2 py-1 font-mono text-[9px] uppercase text-warning">{selected.status.replaceAll("_", " ")}</span></div><p className="mt-6 font-mono text-[9px] uppercase text-slate">{selected.id}</p><h2 className="mt-2 text-xl font-semibold">{detail.account.name}</h2><p className="mt-1 text-sm text-muted">{selected.title}</p><dl className="mt-7 space-y-4 border-t border-border pt-5 text-sm"><div className="flex justify-between"><dt className="text-slate">Draft</dt><dd>v{detail.draft?.version ?? "—"}</dd></div><div className="flex justify-between"><dt className="text-slate">Events</dt><dd>{events.length}</dd></div><div className="flex justify-between"><dt className="text-slate">Channel</dt><dd>{selected.channel}</dd></div></dl><div className="mt-6 flex gap-3 border border-primary/30 bg-primary/5 p-4 text-xs leading-5"><ShieldCheck size={15} className="shrink-0 text-primary"/>Events are persisted and append-only. Resetting demo work preserves this evidence.</div></aside>
      <section className="border border-border bg-[#0d0d0c] p-6 md:p-8"><div className="flex items-end justify-between border-b border-border pb-5"><div><p className="eyebrow">Chain of custody</p><h2 className="mt-2 text-lg font-semibold">{events.length} recorded events</h2></div><span className="font-mono text-[8px] uppercase text-slate">Subject / {selected.id}</span></div><ol className="mt-7">{events.map((event,index) => { const human = event.actorType === "human"; const danger = event.type.includes("failed") || event.type.includes("rejected"); return <li key={event.id} className="grid grid-cols-[4.5rem_1.5rem_1fr] gap-3"><time className="pt-1 font-mono text-[9px] text-slate">{new Date(event.createdAt).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time><span className="flex flex-col items-center"><span className={`flex h-6 w-6 items-center justify-center border ${danger ? "border-danger text-danger" : human ? "border-success text-success" : "border-border-strong text-primary"}`}><Icon event={event}/></span>{index < events.length-1 && <span className="min-h-20 w-px flex-1 bg-border"/>}</span><div className="pb-7"><p className="font-mono text-[8px] uppercase tracking-wider text-primary">{event.actorType} · {event.actorLabel}</p><h3 className="mt-1 text-sm font-semibold">{title(event.type)}</h3><p className="mt-2 text-sm leading-6 text-muted">{summary(event)}</p><p className="mt-2 break-all font-mono text-[8px] text-slate">Event {event.id}</p></div></li>; })}</ol></section></div>
    </>}
  </div>;
}

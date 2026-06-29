import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Eye,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";

const workflow = [
  { name: "Produce", description: "Drafts start from the client playbook." },
  { name: "Verify", description: "Voice, claims, and brand safety are checked." },
  { name: "Proof", description: "A human approves, edits, or rejects." },
  { name: "Schedule", description: "Approved work moves to its channel." },
  { name: "Report", description: "Production and performance form the memo." },
];

const trustItems = [
  {
    number: "01",
    title: "Verifier",
    description: "Every draft is checked against the active client playbook before review.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Human gate",
    description: "Nothing moves forward without a recorded decision from a named reviewer.",
    icon: Eye,
  },
  {
    number: "03",
    title: "Recorded custody",
    description: "Every draft, edit, approval, and publish is preserved in the deliverable record.",
    icon: Fingerprint,
  },
];

const recordEvents = [
  { time: "09:41", event: "Playbook v3 selected", actor: "System" },
  { time: "09:42", event: "Draft v1 created", actor: "Galley" },
  { time: "09:42", event: "Verification completed with 1 note", actor: "Verifier" },
  { time: "10:06", event: "Source note added", actor: "O. Grant" },
  { time: "10:08", event: "Draft v2 approved", actor: "O. Grant" },
];

function Mark() {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center border border-primary/70 font-mono text-sm text-primary">G</span>
      <span className="text-lg font-semibold tracking-[-0.02em]">Galley</span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 px-5 backdrop-blur-sm md:px-10">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between">
          <Link href="/" aria-label="Galley home"><Mark /></Link>
          <div className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#product" className="transition-colors hover:text-foreground">Product</a>
            <a href="#workflow" className="transition-colors hover:text-foreground">Workflow</a>
            <a href="#security" className="transition-colors hover:text-foreground">Security</a>
            <a href="#record" className="transition-colors hover:text-foreground">Records</a>
          </div>
          <Link href="/onboarding" className="border border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-strong">
            Start a proof run
          </Link>
        </div>
      </nav>

      <main>
        <section id="product" className="rule-grid relative border-b border-border px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-48">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div>
              <p className="eyebrow mb-7">Supervised content operations</p>
              <h1 className="editorial-display max-w-4xl text-[4rem] leading-[0.92] text-foreground sm:text-8xl lg:text-[7.2rem]">Proof before press.</h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-muted md:text-lg">
                Galley is the supervised content-operations agent for agencies and DTC teams. It produces, verifies, queues, schedules, and reports client content — with a human at the gate and a record of every move.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/onboarding" className="group inline-flex h-13 items-center justify-center gap-3 bg-primary px-6 font-semibold text-background transition-colors hover:bg-primary-strong">
                  Start a proof run <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#workflow" className="inline-flex h-13 items-center justify-center border border-border-strong px-6 font-semibold text-ink-soft transition-colors hover:border-proof-blue hover:text-foreground">
                  View the workflow
                </a>
              </div>
            </div>

            <div className="border border-border bg-surface p-5 shadow-[14px_14px_0_0_#030302] md:p-7">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="eyebrow">Proof run / 0142</p>
                  <h2 className="mt-2 font-semibold">Aster House · Landing page</h2>
                </div>
                <span className="border border-status-awaiting-proof/40 bg-status-awaiting-proof/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-status-awaiting-proof">Awaiting proof</span>
              </div>
              <div className="py-5">
                <p className="font-mono text-[9px] uppercase tracking-wider text-slate">Draft excerpt</p>
                <blockquote className="editorial-display mt-3 text-2xl leading-8 text-ink-soft">“A room should feel collected, not completed.”</blockquote>
              </div>
              <div className="space-y-3 border-y border-border py-5">
                {["Voice aligned to playbook v3", "Approved claims matched", "One source needs review"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-ink-soft">
                    <span className={`flex h-5 w-5 items-center justify-center border ${index === 2 ? "border-warning/60 text-warning" : "border-success/60 text-success"}`}>
                      {index === 2 ? "!" : <Check size={12} />}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-5 text-center font-mono text-[9px] uppercase tracking-wider">
                <span className="border border-border px-2 py-3 text-muted">Reject draft</span>
                <span className="border border-border px-2 py-3 text-muted">Edit draft</span>
                <span className="bg-foreground px-2 py-3 text-background">Approve draft</span>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate">Nothing publishes without a recorded human yes.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-[#050504] px-5 py-7 md:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-slate sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono uppercase tracking-[0.14em] text-muted">Built for teams where review is part of the work</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 font-medium text-ink-soft">
              <span>Agency operations</span><span>DTC content</span><span>Client services</span>
            </div>
          </div>
        </section>

        <section id="workflow" className="border-b border-border px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <p className="eyebrow">The operating loop</p>
                <h2 className="editorial-display mt-5 text-4xl leading-tight md:text-6xl">One route from playbook to report.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-muted md:justify-self-end">
                Every stage has an owner. Every handoff has a state. V1 centers the validation node: verify, proof, and record.
              </p>
            </div>
            <ol className="mt-16 grid border-l border-t border-border sm:grid-cols-5">
              {workflow.map((item, index) => (
                <li key={item.name} className={`relative min-h-52 border-b border-r border-border p-5 ${item.name === "Proof" ? "bg-surface-raised" : "bg-surface/30"}`}>
                  <span className="font-mono text-[10px] text-slate">0{index + 1}</span>
                  <h3 className="mt-10 text-lg font-semibold">{item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
                  {item.name === "Proof" && <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border bg-[#050504] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="eyebrow">The proof queue is the product</p>
                <h2 className="editorial-display mt-5 text-5xl leading-[1.02] md:text-7xl">Review the exception. Keep the context.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-muted lg:justify-self-end">Draft, verifier evidence, playbook version, and decision controls belong on one surface. No prompt archaeology. No approval in chat.</p>
            </div>

            <div className="mt-14 border border-border bg-surface shadow-[16px_16px_0_0_#000]">
              <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate">GLY-0142 · Aster House</p>
                  <h3 className="mt-2 text-lg font-semibold">Spring collection landing page</h3>
                </div>
                <span className="w-fit border border-warning/40 bg-warning/5 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-warning">Verifier · 1 note</span>
              </div>
              <div className="grid lg:grid-cols-2">
                <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-9">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate">Draft v1 · Website</p>
                  <blockquote className="editorial-display mt-5 max-w-xl text-3xl leading-10 text-ink-soft">“A room should feel collected, not completed. The Aster system evolves with the rituals that make a home yours.”</blockquote>
                </div>
                <div className="p-6 lg:p-9">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-slate">Verifier notes · Playbook v3</p>
                  <div className="mt-5 flex gap-3 border border-warning/30 bg-warning/5 p-4 text-sm leading-6 text-ink-soft">
                    <CircleAlert size={16} className="mt-1 shrink-0 text-warning" />
                    “Evolves with” implies durability. Add the approved source note before approval.
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
                    <span className="border border-border px-3 py-3 text-center text-muted">Reject draft</span>
                    <span className="border border-border px-3 py-3 text-center text-muted">Edit draft</span>
                    <span className="bg-foreground px-3 py-3 text-center font-semibold text-background">Approve draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="record" className="border-b border-border px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="eyebrow">The record is the trust artifact</p>
              <h2 className="editorial-display mt-5 text-5xl leading-[1.03] md:text-7xl">A chain of custody for every asset.</h2>
              <p className="mt-7 max-w-lg text-lg leading-8 text-muted">Every draft, check, edit, and approval stays retrievable. Corrections append to the history; they do not rewrite it.</p>
              <Link href="/dashboard/proof" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-proof-blue hover:text-foreground">View a proof record <ArrowRight size={15} /></Link>
            </div>
            <div className="border border-border bg-surface p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div><p className="font-semibold">Record GLY-0142-R02</p><p className="mt-1 text-xs text-slate">Aster House · Draft v2</p></div>
                <Fingerprint size={20} className="text-primary" />
              </div>
              <ol className="mt-6">
                {recordEvents.map((item, index) => (
                  <li key={item.event} className="grid grid-cols-[3.5rem_1.25rem_1fr] gap-3">
                    <span className="pt-0.5 font-mono text-[9px] text-slate">{item.time}</span>
                    <span className="flex flex-col items-center"><span className={`mt-0.5 h-2.5 w-2.5 border ${index === recordEvents.length - 1 ? "border-success bg-success" : "border-primary"}`} />{index < recordEvents.length - 1 && <span className="h-14 w-px bg-border" />}</span>
                    <div><p className="text-sm font-medium text-ink-soft">{item.event}</p><p className="mt-1 text-xs text-slate">{item.actor}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="security" className="border-b border-border bg-[#050504] px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Security and control</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <h2 className="editorial-display text-5xl leading-tight md:text-7xl">Trust is a visible system state.</h2>
              <p className="max-w-2xl text-lg leading-8 text-muted lg:justify-self-end">Galley shows what generated the draft, what checked it, what failed, who approved it, and where it is allowed to go.</p>
            </div>
            <div className="mt-16 grid border-l border-t border-border md:grid-cols-3">
              {trustItems.map((item) => (
                <article key={item.title} className="border-b border-r border-border p-7 md:min-h-72 md:p-9">
                  <div className="flex items-center justify-between text-primary"><item.icon size={22} strokeWidth={1.5} /><span className="font-mono text-xs">{item.number}</span></div>
                  <h3 className="mt-16 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-4 max-w-sm leading-7 text-muted">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow">Agency economics</p>
              <h2 className="editorial-display mt-6 text-5xl leading-[1.02] md:text-7xl">More account capacity. Fewer execution leaks.</h2>
            </div>
            <div className="border-l border-border-strong pl-7 md:pl-10">
              <p className="text-xl leading-9 text-ink-soft">Each client playbook carries the voice, claims, exclusions, channels, and KPI into review. Managers can hold more client accounts with fewer execution leaks and cleaner reporting.</p>
              <ul className="mt-8 space-y-4 text-sm text-muted">
                {["Proof-ready drafts queued for approval", "One place to approve, edit, or reject", "A client-safe record instead of excuses"].map((item) => <li key={item} className="flex items-center gap-3"><Check size={15} className="text-primary" />{item}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="pricing" className="px-5 py-20 md:px-10 md:py-28">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 border border-border bg-surface p-8 md:flex-row md:items-end md:p-14">
            <div>
              <p className="eyebrow">Design partner onboarding</p>
              <h2 className="editorial-display mt-5 max-w-3xl text-4xl leading-tight md:text-6xl">Content operations, with proof built in.</h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted">Start with one client playbook and one proof run. No autonomous publishing. No hidden handoffs.</p>
            </div>
            <Link href="/onboarding" className="group inline-flex shrink-0 items-center gap-3 bg-primary px-6 py-4 font-semibold text-background hover:bg-primary-strong">Start a proof run <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
          <Link href="/"><Mark /></Link><p>Content operations without the chaos.</p><p>© 2026 Galley</p>
        </div>
      </footer>
    </div>
  );
}

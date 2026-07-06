import { ShieldCheck } from "lucide-react";
import { IntakeForm } from "@/components/galley/IntakeForm";
import { isBackendConfigured, listAccountsWithPlaybooks } from "@/lib/galley/convexData";

export const dynamic = "force-dynamic";

export default async function IntakePage() {
  const configured = isBackendConfigured();
  let error = "";
  let accounts = [] as Awaited<ReturnType<typeof listAccountsWithPlaybooks>>;
  if (configured) {
    try {
      accounts = await listAccountsWithPlaybooks();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Unable to load client accounts.";
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Bring your own draft</p>
        <h1 className="editorial-display mt-4 text-5xl md:text-6xl">Submit a draft</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Galley verifies content produced anywhere — an agency writer, another AI tool, a client
          document. The draft is checked against the client playbook and stops at the human gate.
        </p>
        <div className="mt-6 flex w-fit items-center gap-3 border border-success/30 bg-success/5 px-4 py-3 text-xs text-success">
          <ShieldCheck size={15} /> Every submission is verified before it can be proofed
        </div>
      </header>

      <section className="mt-8 border border-border bg-surface p-6 md:p-8">
        {(!configured || error) ? (
          <p className="text-sm leading-6 text-muted">
            {error || "Set NEXT_PUBLIC_CONVEX_URL and deploy the Convex functions to submit drafts."}
          </p>
        ) : (
          <IntakeForm accounts={accounts} />
        )}
      </section>

      <p className="mt-6 border-t border-border pt-6 text-xs leading-5 text-slate">
        Submitted drafts are immutable versions. The verifier result, the reviewer decision, and
        every state change are appended to the permanent record.
      </p>
    </div>
  );
}

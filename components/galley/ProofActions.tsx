"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleX, PencilLine } from "lucide-react";
import {
  approveDeliverableAction,
  editDeliverableAction,
  rejectDeliverableAction,
  type GalleyActionResult,
} from "@/app/dashboard/proof/actions";

export function ProofActions({ deliverableId, draftContent }: { deliverableId: string; draftContent: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(draftContent);
  const [result, setResult] = useState<GalleyActionResult | null>(null);

  const run = (action: () => Promise<GalleyActionResult>) => startTransition(async () => {
    const next = await action();
    setResult(next);
    if (next.ok) {
      setEditing(false);
      router.refresh();
    }
  });

  if (editing) {
    return (
      <div className="space-y-2 lg:w-72">
        <label className="block font-mono text-[9px] uppercase tracking-wider text-slate" htmlFor={`edit-${deliverableId}`}>Edit this version</label>
        <textarea id={`edit-${deliverableId}`} value={content} onChange={(event) => setContent(event.target.value)} className="min-h-32 w-full border border-border bg-background p-3 text-xs leading-5 text-foreground outline-none focus:border-primary" />
        <div className="grid grid-cols-2 gap-2">
          <button disabled={pending} onClick={() => run(() => editDeliverableAction(deliverableId, content))} className="bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:opacity-50">Save + verify</button>
          <button disabled={pending} onClick={() => setEditing(false)} className="border border-border px-3 py-2 text-xs text-muted">Cancel</button>
        </div>
        {result && <p role="status" className={`text-[11px] ${result.ok ? "text-success" : "text-danger"}`}>{result.message}</p>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 lg:w-52">
      <button disabled={pending} onClick={() => run(() => approveDeliverableAction(deliverableId))} className="col-span-2 inline-flex min-h-10 items-center justify-center gap-2 bg-foreground px-3 text-xs font-semibold text-background disabled:opacity-50"><Check size={14} /> {pending ? "Recording…" : "Approve draft"}</button>
      <button disabled={pending} onClick={() => setEditing(true)} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-border text-[11px] text-muted"><PencilLine size={13} /> Edit</button>
      <button disabled={pending} onClick={() => run(() => rejectDeliverableAction(deliverableId))} className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-border text-[11px] text-muted hover:text-danger"><CircleX size={13} /> Reject</button>
      {result && <p role="status" className={`col-span-2 text-[11px] ${result.ok ? "text-success" : "text-danger"}`}>{result.message}</p>}
    </div>
  );
}

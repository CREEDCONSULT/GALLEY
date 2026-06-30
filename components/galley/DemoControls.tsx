"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Database, RotateCcw } from "lucide-react";
import { resetValidationNodeDemo, seedValidationNodeDemo, type GalleyActionResult } from "@/app/dashboard/proof/actions";

export function DemoControls({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<GalleyActionResult | null>(null);
  const run = (action: () => Promise<GalleyActionResult>) => startTransition(async () => {
    const next = await action(); setResult(next); if (next.ok) router.refresh();
  });
  return (
    <div className="border border-border bg-surface p-4">
      <p className="font-mono text-[9px] uppercase tracking-wider text-primary">Local demo controls</p>
      <p className="mt-2 text-xs leading-5 text-muted">Seed persisted validation records or reset generated work. The append-only event history remains intact.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={!enabled || pending} onClick={() => run(seedValidationNodeDemo)} className="inline-flex items-center gap-2 bg-primary px-3 py-2 text-xs font-semibold text-background disabled:opacity-40"><Database size={13} /> Seed demo</button>
        <button disabled={!enabled || pending} onClick={() => run(resetValidationNodeDemo)} className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs text-muted disabled:opacity-40"><RotateCcw size={13} /> Reset work</button>
      </div>
      {result && <p role="status" className={`mt-3 text-[11px] ${result.ok ? "text-success" : "text-danger"}`}>{result.message}</p>}
    </div>
  );
}

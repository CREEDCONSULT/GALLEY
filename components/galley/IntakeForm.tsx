"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileUp } from "lucide-react";
import { submitDraftAction, type IntakeResult } from "@/app/dashboard/intake/actions";
import type { ClientAccount, Playbook } from "@/lib/galley/types";

const fieldClass =
  "mt-2 w-full border border-border bg-[#0d0d0c] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-slate focus:border-primary";
const labelClass = "block text-sm font-medium text-ink-soft";

export function IntakeForm({
  accounts,
}: {
  accounts: Array<{ account: ClientAccount; playbook: Playbook | null }>;
}) {
  const router = useRouter();
  const usable = useMemo(() => accounts.filter((row) => row.playbook), [accounts]);
  const [accountId, setAccountId] = useState(usable[0]?.account.id ?? "");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Article");
  const [channel, setChannel] = useState("");
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<IntakeResult | null>(null);

  const selected = usable.find((row) => row.account.id === accountId);
  const channels = selected?.playbook?.channels ?? [];
  const effectiveChannel = channels.includes(channel) ? channel : channels[0] ?? "";

  const submit = () =>
    startTransition(async () => {
      const next = await submitDraftAction({
        accountId,
        title,
        type,
        channel: effectiveChannel,
        content,
      });
      setResult(next);
      if (next.ok) {
        setTitle("");
        setContent("");
        router.refresh();
      }
    });

  if (usable.length === 0) {
    return (
      <p className="border border-warning/30 bg-warning/5 p-6 text-sm leading-6 text-muted">
        No client account has a playbook yet. Create one in Playbooks first — the verifier needs
        rules to check a draft against.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="intake-account">Client account</label>
          <select
            id="intake-account"
            value={accountId}
            onChange={(event) => setAccountId(event.target.value)}
            className={fieldClass}
          >
            {usable.map(({ account, playbook }) => (
              <option key={account.id} value={account.id}>
                {account.name} — playbook v{playbook?.version}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="intake-channel">Channel</label>
          <select
            id="intake-channel"
            value={effectiveChannel}
            onChange={(event) => setChannel(event.target.value)}
            className={fieldClass}
          >
            {channels.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="intake-title">Deliverable title</label>
          <input
            id="intake-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="July launch announcement"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="intake-type">Type</label>
          <input
            id="intake-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            placeholder="Article, Email, Paid social…"
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="intake-content">Draft content</label>
        <textarea
          id="intake-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Paste the draft exactly as it would ship. The verifier checks it against the client playbook."
          className={`${fieldClass} min-h-56`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          disabled={pending}
          onClick={submit}
          className="inline-flex min-h-11 items-center gap-2.5 bg-primary px-5 text-sm font-semibold text-background disabled:opacity-50"
        >
          <FileUp size={15} /> {pending ? "Verifying…" : "Submit for verification"}
        </button>
        {result?.ok && result.deliverableId && (
          <button
            onClick={() => router.push(`/dashboard/records?deliverable=${result.deliverableId}`)}
            className="inline-flex items-center gap-1.5 text-sm text-proof-blue"
          >
            View the record <ArrowRight size={14} />
          </button>
        )}
      </div>
      {result && (
        <p role="status" className={`text-sm leading-6 ${result.ok ? "text-success" : "text-danger"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}

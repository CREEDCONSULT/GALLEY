"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveOnboardingData } from "./action";

type PlaybookData = {
  client_name: string;
  website: string;
  industry: string;
  target_audience: string;
  primary_offer: string;
  channels: string[];
  brand_voice: string;
  approved_claims: string;
  forbidden_claims: string;
  competitor_urls: string;
  reporting_kpi: string;
};

const initialData: PlaybookData = {
  client_name: "",
  website: "",
  industry: "",
  target_audience: "",
  primary_offer: "",
  channels: [],
  brand_voice: "",
  approved_claims: "",
  forbidden_claims: "",
  competitor_urls: "",
  reporting_kpi: "",
};

const chapters = ["Account", "Guardrails", "Measurement"];
const channelOptions = ["Website", "Email", "LinkedIn", "Instagram", "TikTok", "Paid social"];

const fieldClass = "mt-2 min-h-12 w-full border border-border bg-[#0d0d0c] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-slate focus:border-primary";
const labelClass = "block text-sm font-medium text-ink-soft";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<PlaybookData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    let restoreTimer: number | undefined;
    const saved = window.localStorage.getItem("galley_playbook");
    if (saved) {
      try {
        const restored = { ...initialData, ...JSON.parse(saved) } as PlaybookData;
        restoreTimer = window.setTimeout(() => setData(restored), 0);
      } catch {
        window.localStorage.removeItem("galley_playbook");
      }
    }

    return () => {
      if (restoreTimer) window.clearTimeout(restoreTimer);
    };
  }, []);

  const update = <K extends keyof PlaybookData>(key: K, value: PlaybookData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const toggleChannel = (channel: string) => {
    update(
      "channels",
      data.channels.includes(channel)
        ? data.channels.filter((item) => item !== channel)
        : [...data.channels, channel],
    );
  };

  const canContinue = step === 1
    ? Boolean(data.client_name && data.website && data.industry && data.target_audience && data.primary_offer)
    : step === 2
      ? Boolean(data.channels.length && data.brand_voice && data.approved_claims && data.forbidden_claims)
      : Boolean(data.reporting_kpi);

  const completeSetup = async () => {
    setIsSaving(true);
    setError("");
    window.localStorage.setItem("galley_playbook", JSON.stringify(data));

    const result = await saveOnboardingData({
      client_name: data.client_name,
      website: data.website,
      industry: data.industry,
      target_audience: data.target_audience,
      primary_offer: data.primary_offer,
      channels: data.channels,
      brand_voice: data.brand_voice,
      approved_claims: data.approved_claims,
      forbidden_claims: data.forbidden_claims,
      reporting_kpi: data.reporting_kpi,
    });
    if (!result.success) {
      setError(result.error ?? "We could not save this playbook.");
      setIsSaving(false);
      return;
    }

    window.localStorage.removeItem("galley_playbook");
    router.push("/dashboard/proof");
  };

  return (
    <div className="rule-grid min-h-[calc(100vh-4.5rem)] px-5 py-12 md:px-10 md:py-18">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.52fr_1fr] lg:gap-18">
          <aside>
            <p className="eyebrow">New playbook</p>
            <h1 className="editorial-display mt-4 text-4xl leading-[1.02] md:text-5xl lg:mt-5 lg:text-6xl">Give every proof run a standard.</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted lg:mt-6 lg:text-base lg:leading-7">
              Capture what the verifier and reviewer need to know before a draft reaches the desk.
            </p>
            <ol className="mt-6 grid grid-cols-3 border-l border-t border-border lg:mt-10 lg:block lg:border-l-0">
              {chapters.map((chapter, index) => (
                <li key={chapter} className={`flex flex-col items-start gap-2 border-b border-r border-border px-2 py-3 lg:flex-row lg:items-center lg:gap-4 lg:border-r-0 lg:px-0 lg:py-4 ${step === index + 1 ? "bg-surface/50 text-foreground lg:bg-transparent" : "text-slate"}`}>
                  <span className={`flex h-7 w-7 items-center justify-center border font-mono text-[10px] ${step > index + 1 ? "border-success text-success" : step === index + 1 ? "border-primary text-primary" : "border-border"}`}>
                    {step > index + 1 ? <Check size={13} /> : `0${index + 1}`}
                  </span>
                  <span className="text-sm font-medium">{chapter}</span>
                </li>
              ))}
            </ol>
          </aside>

          <section className="border border-border bg-surface p-6 shadow-[12px_12px_0_0_#0b0b0a] md:p-10">
            <div className="border-b border-border pb-6">
              <p className="eyebrow">Chapter 0{step} / 03</p>
              <h2 className="mt-3 text-2xl font-semibold">
                {step === 1 && "Client account"}
                {step === 2 && "Editorial guardrails"}
                {step === 3 && "Competitive and reporting context"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {step === 1 && "The commercial and audience context behind every deliverable."}
                {step === 2 && "The rules Galley should surface during verification."}
                {step === 3 && "The references and outcome the account is accountable for."}
              </p>
              <p className="mt-4 border-l border-primary pl-3 text-xs leading-5 text-ink-soft">The saved playbook becomes the source of truth for every verifier check and proof decision.</p>
            </div>

            {step === 1 && (
              <div className="mt-7 space-y-8">
                <fieldset>
                  <legend className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">Account identity</legend>
                  <p className="mt-2 text-xs leading-5 text-slate">Used to scope the playbook and identify the client throughout the proof record.</p>
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <label className={labelClass}>Client account name
                      <input required className={fieldClass} value={data.client_name} onChange={(e) => update("client_name", e.target.value)} placeholder="Glow Skincare" />
                    </label>
                    <label className={labelClass}>Website
                      <input required className={fieldClass} type="url" value={data.website} onChange={(e) => update("website", e.target.value)} placeholder="https://glowskincare.com" />
                    </label>
                    <label className={`${labelClass} md:col-span-2`}>Industry
                      <input required className={fieldClass} value={data.industry} onChange={(e) => update("industry", e.target.value)} placeholder="Skincare and personal care" />
                    </label>
                  </div>
                </fieldset>
                <fieldset className="border-t border-border pt-7">
                  <legend className="px-0 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">Audience and offer</legend>
                  <p className="mt-2 text-xs leading-5 text-slate">Gives reviewers the commercial context behind claims, voice, and calls to action.</p>
                  <div className="mt-4 grid gap-6 md:grid-cols-2">
                    <label className={labelClass}>Target audience
                      <input required className={fieldClass} value={data.target_audience} onChange={(e) => update("target_audience", e.target.value)} placeholder="Ingredient-aware customers with sensitive skin" />
                    </label>
                    <label className={labelClass}>Primary offer
                      <textarea required className={`${fieldClass} min-h-24 resize-y`} value={data.primary_offer} onChange={(e) => update("primary_offer", e.target.value)} placeholder="What is being sold, and why does it matter?" />
                    </label>
                  </div>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="mt-7 space-y-7">
                <fieldset>
                  <legend className={labelClass}>Channels</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {channelOptions.map((channel) => {
                      const selected = data.channels.includes(channel);
                      return (
                        <button key={channel} type="button" onClick={() => toggleChannel(channel)} aria-pressed={selected} className={`border px-3.5 py-2 text-sm transition-colors ${selected ? "border-primary bg-primary/10 text-primary-strong" : "border-border bg-[#0d0d0c] text-muted hover:border-border-strong"}`}>
                          {channel}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <label className={labelClass}>Brand voice
                  <textarea className={`${fieldClass} min-h-24 resize-y`} value={data.brand_voice} onChange={(e) => update("brand_voice", e.target.value)} placeholder="Precise, warm, informed. Never breathless or overly familiar." />
                </label>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className={labelClass}>Approved claims
                    <textarea className={`${fieldClass} min-h-32 resize-y`} value={data.approved_claims} onChange={(e) => update("approved_claims", e.target.value)} placeholder="One claim per line, with source notes where relevant." />
                  </label>
                  <label className={labelClass}>Forbidden claims
                    <textarea className={`${fieldClass} min-h-32 resize-y`} value={data.forbidden_claims} onChange={(e) => update("forbidden_claims", e.target.value)} placeholder="Claims, comparisons, or phrases that must not appear." />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-7 space-y-6">
                <label className={labelClass}>Competitor URLs <span className="font-normal text-slate">(optional)</span>
                  <textarea className={`${fieldClass} min-h-32 resize-y font-mono text-xs`} value={data.competitor_urls} onChange={(e) => update("competitor_urls", e.target.value)} placeholder={"https://competitor-one.com\nhttps://competitor-two.com"} />
                  <span className="mt-2 block text-xs text-slate">One URL per line. Used as context, never as source copy.</span>
                </label>
                <label className={labelClass}>Reporting KPI
                  <input className={fieldClass} value={data.reporting_kpi} onChange={(e) => update("reporting_kpi", e.target.value)} placeholder="Qualified product-page visits" />
                  <span className="mt-2 block text-xs text-slate">Choose the primary outcome this account will report against.</span>
                </label>
                <div className="border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-ink-soft">
                  Approval will clear a draft for the future scheduling stage. It will not publish anything automatically.
                </div>
              </div>
            )}

            {error && <p role="alert" className="mt-6 border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</p>}

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1} className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:invisible">
                <ArrowLeft size={16} /> Back
              </button>
              {step < 3 ? (
                <button type="button" onClick={() => setStep((current) => Math.min(3, current + 1))} disabled={!canContinue} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-35">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={completeSetup} disabled={!canContinue || isSaving} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-primary-strong disabled:opacity-35">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                  Save playbook and open proof desk
                </button>
              )}
            </div>
            {!canContinue && <p className="mt-3 text-right text-xs text-slate">Complete the required playbook fields to continue.</p>}
          </section>
        </div>
      </div>
    </div>
  );
}

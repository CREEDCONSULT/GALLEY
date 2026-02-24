"use client";

import { ArrowLeft, Rocket, ExternalLink, ShieldAlert, Loader2 } from "lucide-react";

export default function Step3Integrations({
    data,
    prev,
    onComplete,
    isSaving,
    isAuthenticated
}: any) {
    return (
        <div className="space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#10B981]/10 text-[#10B981] shadow-lg shadow-[#10B981]/10">
                <Rocket size={40} className="animate-bounce" />
            </div>

            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black tracking-tight">Configuration <span className="text-[#10B981] italic">Complete</span></h2>
                <p className="text-slate">Successfully cloned your brand identity for <span className="text-white font-mono">{data.website.replace('https://', '')}</span></p>
            </div>

            <div className="glass p-6 rounded-2xl text-left border border-[#F59E0B]/20 bg-[#F59E0B]/5">
                <div className="flex gap-3 mb-2">
                    <ShieldAlert className="text-[#F59E0B]" size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest text-[#F59E0B]">Final Requirement</span>
                </div>
                <p className="text-sm text-slate leading-relaxed mb-4">
                    {isAuthenticated
                        ? "To start publishing directly, you'll need to link your WordPress settings in the dashboard."
                        : "To save your brand profile and enter the dashboard, please sign in with a magic link."}
                </p>
                <button
                    onClick={onComplete}
                    disabled={isSaving}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#10B981] text-white font-black shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isSaving ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <>
                            {isAuthenticated ? "Enter Dashboard" : "Sign in to Complete"} <ExternalLink size={18} />
                        </>
                    )}
                </button>
            </div>

            <button onClick={prev} className="inline-flex items-center gap-2 text-slate text-sm font-medium hover:text-white transition-colors">
                <ArrowLeft size={14} /> Back to Voice Tuning
            </button>
        </div>
    );
}


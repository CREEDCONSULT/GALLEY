"use client";

import { useState } from "react";
import { Globe, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function Step1Business({ data, setData, next }: any) {
    const [isCrawling, setIsCrawling] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const startCrawl = () => {
        if (!data.website) return;
        setIsCrawling(true);
        // Simulate crawl delay
        setTimeout(() => {
            setIsCrawling(false);
            setShowPreview(true);
        }, 2500);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Tell us about your <span className="text-primary italic">domain</span></h2>
                <p className="text-slate italic">Enter your website URL so ContentFlow can analyze your industry and niche.</p>
            </div>

            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate group-focus-within:text-primary transition-colors">
                    <Globe size={20} />
                </div>
                <input
                    type="text"
                    placeholder="https://your-business.com"
                    value={data.website}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    className="w-full h-14 pl-12 pr-32 rounded-2xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-all placeholder:text-white/20"
                />
                <button
                    onClick={startCrawl}
                    disabled={!data.website || isCrawling}
                    className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:grayscale disabled:scale-100 transition-all"
                >
                    {isCrawling ? <Loader2 className="animate-spin" size={18} /> : "Analyze"}
                </button>
            </div>

            {showPreview && (
                <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/5 p-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="text-[#10B981]" size={18} />
                        <span className="text-sm font-bold uppercase tracking-widest text-[#10B981]">Site Data Found</span>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl space-y-1">
                        <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                    </div>
                    <button
                        onClick={next}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-black transition-all hover:gap-4"
                    >
                        Confirm & Continue <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}

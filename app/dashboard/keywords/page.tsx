"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    TrendingUp,
    Target,
    Sparkles,
    Plus,
    Filter,
    ArrowUpRight,
    Zap,
    Brain,
    Loader2,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

const mockKeywords = [
    { id: 1, keyword: "legal automation for startups", volume: 1200, difficulty: 24, intent: "Commercial", status: "Open" },
    { id: 2, keyword: "how to scale law firm with AI", volume: 850, difficulty: 42, intent: "Informational", status: "Open" },
    { id: 3, keyword: "business compliance checklist 2026", volume: 3400, difficulty: 18, intent: "Transaction", status: "In Progress" },
    { id: 4, keyword: "AI contract review tool features", volume: 450, difficulty: 56, intent: "Commercial", status: "Open" },
    { id: 5, keyword: "automated document drafting software", volume: 2100, difficulty: 38, intent: "Commercial", status: "Open" },
];

export default function KeywordsPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [keywords, setKeywords] = useState(mockKeywords);

    const handleDiscover = () => {
        setIsSearching(true);
        // Simulate AI Research
        setTimeout(() => {
            setIsSearching(false);
        }, 3000);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">The <span className="text-[#3B82F6] italic">Pulse</span> Research</h1>
                    <p className="text-slate-400 mt-2 max-w-xl">
                        Our AI Agent scans live search data and your competitors to find high-ROI keywords others miss.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="h-12 px-6 rounded-xl border border-white/5 bg-white/5 text-slate-400 font-bold hover:text-white transition-all flex items-center gap-2">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={handleDiscover}
                        disabled={isSearching}
                        className="h-12 px-6 rounded-xl bg-[#3B82F6] text-white font-bold shadow-lg shadow-[#3B82F6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        {isSearching ? "Agent Researching..." : "Discover New Patterns"}
                    </button>
                </div>
            </div>

            {/* Strategy Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-dark p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-[#3B82F6]/10 to-transparent">
                    <div className="flex items-center gap-3 text-[#3B82F6] mb-4">
                        <Brain size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Active Focus</span>
                    </div>
                    <h3 className="text-lg font-bold">Legal Tech Automation</h3>
                    <p className="text-xs text-slate-500 mt-1">Targeting high-intent commercial keywords in the US market.</p>
                </div>
                <div className="glass-dark p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 text-emerald-400 mb-4">
                        <Target size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Market Gap</span>
                    </div>
                    <h3 className="text-lg font-bold">"Compliance 2026"</h3>
                    <p className="text-xs text-slate-500 mt-1">Identified as a low-competition, high-growth niche.</p>
                </div>
                <div className="glass-dark p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 text-amber-400 mb-4">
                        <Zap size={20} />
                        <span className="text-xs font-black uppercase tracking-widest">Agent Logic</span>
                    </div>
                    <h3 className="text-lg font-bold">Semantic Clustering</h3>
                    <p className="text-xs text-slate-500 mt-1">Grouping topics to maximize authority in Legal SaaS.</p>
                </div>
            </div>

            {/* Keyword Table */}
            <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search discovered keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/20 border border-white/5 focus:border-[#3B82F6] outline-none transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                        <span>Showing 42 discoveries</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Keyword Pattern</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Vol / Mo</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Difficulty</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Intent</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {keywords.map((kw, i) => (
                                    <motion.tr
                                        key={kw.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-white/[0.02] transition-all cursor-default"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-[#3B82F6] group-hover:animate-ping" />
                                                <span className="font-bold text-lg group-hover:text-[#3B82F6] transition-colors">{kw.keyword}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={14} className="text-emerald-400" />
                                                <span className="font-black">{kw.volume.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${kw.difficulty < 30 ? 'bg-emerald-400' : kw.difficulty < 50 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                                        style={{ width: `${kw.difficulty}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-black text-slate-400">{kw.difficulty}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${kw.intent === 'Commercial' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' :
                                                    kw.intent === 'Informational' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        'bg-purple-500/10 text-purple-400'
                                                }`}>
                                                {kw.intent}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {kw.status === 'Open' ? (
                                                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6] transition-all group-hover:translate-x-[-4px]">
                                                    <Plus size={14} />
                                                    Forge Asset
                                                </button>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 text-emerald-400 text-xs font-bold">
                                                    <CheckCircle2 size={14} />
                                                    In Forge
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insight Banner */}
            <div className="glass-dark p-8 rounded-3xl border border-[#3B82F6]/20 bg-[#3B82F6]/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all pointer-events-none">
                    <Bot size={120} className="text-[#3B82F6]" />
                </div>
                <div className="max-w-3xl relative z-10">
                    <div className="flex items-center gap-2 text-[#3B82F6] mb-4">
                        <div className="h-6 w-6 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                            <Brain size={16} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Agent Recommendation</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Focus on "Legal SaaS Automation" clusters for the next 48 hours.</h2>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        We've detected a significant drop in competitor bidding for semantic variations of "automated legal drafting". High-volume, low-COI opportunity detected. Launching assets now could capture top search positions before the weekend crawl.
                    </p>
                    <button className="flex items-center gap-2 text-[#3B82F6] font-black group">
                        Start Batch Production
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Sub-components as needed
function Bot({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
        </svg>
    )
}

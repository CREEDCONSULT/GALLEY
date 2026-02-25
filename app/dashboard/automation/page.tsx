"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    RefreshCw,
    Play,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Settings2,
    Activity,
    Bot,
    Terminal,
    Cpu,
    Network,
    Globe,
    Target,
    FileText
} from "lucide-react";


export default function AutomationPage() {
    const [isRunning, setIsRunning] = useState(false);

    const workflows = [
        {
            id: 1,
            name: "The Pulse: Daily Research",
            description: "Keyword discovery via n8n + Google Search Console.",
            status: "Scheduled",
            lastRun: "3 hours ago",
            nextRun: "In 21 hours",
            type: "n8n"
        },
        {
            id: 2,
            name: "The Forge: Draft Generation",
            description: "Auto-generate content briefs for discovered keywords.",
            status: "Idle",
            lastRun: "1 day ago",
            nextRun: "On Demand",
            type: "Supabase Edge"
        },
        {
            id: 3,
            name: "WordPress Pipeline",
            description: "Sync approved content to WordPress sites.",
            status: "Active",
            lastRun: "14 mins ago",
            nextRun: "In 46 mins",
            type: "Webhook"
        }
    ];

    const logs = [
        { time: "20:42:01", event: "n8n Webhook Received: Keyword discovery trigger.", status: "success" },
        { time: "20:42:05", event: "Analyzing 12 new keyword clusters...", status: "success" },
        { time: "20:42:12", event: "Database Sync: 3 High-ROI patterns stored in profiles.", status: "success" },
        { time: "20:43:00", event: "Edge Function: Brand voice fixation check complete.", status: "success" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Automation <span className="text-[#3B82F6] italic">Pilot</span></h1>
                    <p className="text-slate-400 mt-2 max-w-xl">
                        Manage your autonomous content pipeline. Orchestrate n8n, Supabase Functions, and publishing crons.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="h-12 px-6 rounded-xl border border-white/5 bg-white/5 text-slate-400 font-bold hover:text-white transition-all flex items-center gap-2">
                        <Settings2 size={18} />
                        Global Config
                    </button>
                    <button
                        onClick={() => setIsRunning(true)}
                        className="h-12 px-6 rounded-xl bg-[#3B82F6] text-white font-bold shadow-lg shadow-[#3B82F6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Play size={18} />
                        Run All Workflows
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Workflows & Approvals */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Approval Inbox Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Approval Inbox</h3>
                            <span className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                2 Actions Required
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { type: 'Brief', title: 'Legal Automation for Startups', roi: '+24% Traffic Est.' },
                                { type: 'Polish', title: 'The Future of AI Contracts', roi: 'Ready for WP' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -4 }}
                                    className="glass-dark p-6 rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#3B82F6]/5 to-transparent flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#3B82F6] mb-3">
                                            {item.type === 'Brief' ? <Target size={12} /> : <FileText size={12} />}
                                            {item.type} Approval
                                        </div>
                                        <h4 className="font-bold text-lg leading-tight mb-2">{item.title}</h4>
                                        <span className="text-xs text-emerald-400 font-bold">{item.roi}</span>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <button className="flex-1 h-10 rounded-xl bg-[#3B82F6] text-white text-xs font-bold hover:scale-105 transition-all">
                                            Approve
                                        </button>
                                        <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/5 text-xs font-bold hover:bg-white/10 transition-all">
                                            Review
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Workflow List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Active Workflows</h3>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                                <Activity size={14} className="animate-pulse" />
                                3 Engines Online
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {workflows.map((wf) => (
                                <motion.div
                                    key={wf.id}
                                    whileHover={{ scale: 1.01 }}
                                    className="glass-dark p-6 rounded-3xl border border-white/5 group cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${wf.status === 'Active' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                <Cpu size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold group-hover:text-[#3B82F6] transition-colors">{wf.name}</h4>
                                                <p className="text-sm text-slate-500 mt-1">{wf.description}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${wf.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                                wf.status === 'Scheduled' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-slate-500/10 text-slate-400'
                                                }`}>
                                                {wf.status}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Clock size={12} />
                                                Last: {wf.lastRun}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={20} className="text-[#3B82F6]" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Automation Inspector (Logs) */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">System Inspector</h3>
                    <div className="glass-dark rounded-3xl border border-white/5 bg-black/40 flex flex-col h-full min-h-[500px] overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-slate-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Real-time Logs</span>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="p-6 space-y-4 font-mono text-[11px] overflow-y-auto custom-scrollbar flex-1">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <span className="text-slate-600 shrink-0">{log.time}</span>
                                    <span className={`leading-relaxed ${log.status === 'error' ? 'text-rose-400' : 'text-slate-300'}`}>
                                        <span className="text-emerald-400 mr-2">➜</span>
                                        {log.event}
                                    </span>
                                </div>
                            ))}
                            <div className="flex gap-4 animate-pulse">
                                <span className="text-slate-600 shrink-0">20:43:05</span>
                                <span className="text-[#3B82F6]">Waiting for next trigger...</span>
                            </div>
                        </div>

                        {/* Network Topology Graphic */}
                        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Network Topology</span>
                                <Network size={14} className="text-slate-700" />
                            </div>
                            <div className="flex items-center justify-center gap-4 py-4">
                                <div className="h-10 w-10 rounded-full border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                                    <Globe size={18} />
                                </div>
                                <div className="h-px w-8 bg-gradient-to-r from-[#3B82F6]/30 to-[#3B82F6]/30" />
                                <div className="h-14 w-14 rounded-full border border-[#3B82F6] flex items-center justify-center text-[#3B82F6] shadow-lg shadow-[#3B82F6]/20 bg-[#3B82F6]/5">
                                    <Zap size={24} />
                                </div>
                                <div className="h-px w-8 bg-gradient-to-r from-[#3B82F6]/30 to-[#3B82F6]/30" />
                                <div className="h-10 w-10 rounded-full border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                                    <Bot size={18} />
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] font-bold text-slate-600">Syncing: n8n ↔ Supabase ↔ WordPress</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Automation ROI Banner */}
            <div className="glass-dark p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={40} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Automation has saved you <span className="text-emerald-400">14.2 hours</span> this week.</h3>
                    <p className="text-slate-400">Your AI Pilot has discovered 12 keywords and generated 4 content briefs without manual intervention.</p>
                </div>
                <button className="px-8 py-4 rounded-2xl bg-emerald-400 text-black font-black hover:scale-105 active:scale-95 transition-all w-full md:w-auto">
                    View Impact Report
                </button>
            </div>
        </div>
    );
}

"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Calendar as CalendarIcon,
    FileText,
    CheckCircle2
} from "lucide-react";

export default function CalendarPage() {
    const days = [
        { day: 1, type: 'past' }, { day: 2, type: 'past' }, { day: 3, type: 'past' }, { day: 4, type: 'past' }, { day: 5, type: 'past' }, { day: 6, type: 'past' }, { day: 7, type: 'past' },
        { day: 8, type: 'past' }, { day: 9, type: 'past' }, { day: 10, type: 'past' }, { day: 11, type: 'past' }, { day: 12, type: 'past' }, { day: 13, type: 'past' }, { day: 14, type: 'past' },
        { day: 15, type: 'past' }, { day: 16, type: 'current', content: "SEO Strategies 2026", status: "Published" }, { day: 17, type: 'current' }, { day: 18, type: 'current' }, { day: 19, type: 'current', content: "AI in Marketing", status: "Scheduled" }, { day: 20, type: 'current' }, { day: 21, type: 'current' },
        { day: 22, type: 'current' }, { day: 23, type: 'current' }, { day: 24, type: 'current', today: true, content: "Local SEO Guide", status: "Draft" }, { day: 25, type: 'current' }, { day: 26, type: 'current' }, { day: 27, type: 'current' }, { day: 28, type: 'current' },
        { day: 29, type: 'future' }, { day: 30, type: 'future' }, { day: 31, type: 'future' },
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">The <span className="text-[#3B82F6] italic">Map</span></h1>
                    <p className="text-slate-400 mt-2">Manage your 30-day content pipeline with drag-and-drop precision.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center glass-dark rounded-xl border border-white/5 h-12 p-1">
                        <button className="px-4 py-2 rounded-lg bg-[#3B82F6] text-white font-bold text-sm transition-all shadow-md">Month</button>
                        <button className="px-4 py-2 rounded-lg text-slate-400 font-bold text-sm hover:text-white transition-all">Week</button>
                    </div>
                    <button className="flex h-12 items-center gap-2 px-6 rounded-xl bg-[#3B82F6] text-white font-bold shadow-lg shadow-[#3B82F6]/20 hover:scale-105 active:scale-95 transition-all">
                        <Plus size={18} />
                        New Entry
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    February 2026
                    <div className="flex gap-2">
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/5 glass-dark hover:border-white/20 transition-all">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/5 glass-dark hover:border-white/20 transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </h2>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Published</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-500"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Draft</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-white/5">
                    {weekDays.map((wd) => (
                        <div key={wd} className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-600 border-r last:border-0 border-white/5">
                            {wd}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((d, i) => (
                        <div
                            key={i}
                            className={`
                                min-h-[160px] p-4 border-r border-b border-white/5 last:border-r-0 transition-colors
                                ${d.type === 'past' ? 'bg-black/10 text-slate-700' : 'hover:bg-white/[0.01]'}
                                ${d.today ? 'bg-[#3B82F6]/5' : ''}
                            `}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`
                                    text-lg font-bold h-8 w-8 flex items-center justify-center rounded-lg
                                    ${d.today ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20' : ''}
                                `}>
                                    {d.day}
                                </span>
                                {d.content && (
                                    <div className={`h-2 w-2 rounded-full ${d.status === 'Published' ? 'bg-emerald-400' :
                                            d.status === 'Scheduled' ? 'bg-[#3B82F6]' : 'bg-slate-500'
                                        }`} />
                                )}
                            </div>

                            {d.content && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`
                                        p-3 rounded-xl border text-xs font-bold cursor-pointer group transition-all
                                        ${d.status === 'Published' ? 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10' :
                                            d.status === 'Scheduled' ? 'border-[#3B82F6]/20 bg-[#3B82F6]/5 hover:bg-[#3B82F6]/10' :
                                                'border-slate-500/20 bg-slate-500/5 hover:bg-slate-500/10'}
                                    `}
                                >
                                    <div className="flex items-start gap-2">
                                        <FileText size={14} className="mt-0.5 flex-shrink-0" />
                                        <span className="leading-tight truncate-2">{d.content}</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between opacity-50">
                                        <span>Status: {d.status}</span>
                                        {d.status === 'Published' && <CheckCircle2 size={12} />}
                                    </div>
                                </motion.div>
                            )}

                            {!d.content && d.type !== 'past' && (
                                <button className="w-full h-12 rounded-xl border border-dashed border-white/5 flex items-center justify-center text-slate-800 hover:text-slate-400 hover:border-slate-600 transition-all group opacity-0 hover:opacity-100">
                                    <Plus size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .truncate-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}

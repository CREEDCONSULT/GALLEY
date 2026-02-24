"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    FileText,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Plus,
    Youtube,
    Globe,
    CheckCircle2,
    Bot,
    ChevronRight,
    Search
} from "lucide-react";



const stats = [
    { name: "Total Traffic", value: "12,450", change: "+12.5%", trendingUp: true, icon: Users, color: "#3B82F6" },
    { name: "SEO Score (Avg)", value: "84/100", change: "+4.2%", trendingUp: true, icon: BarChart3, color: "#10B981" },
    { name: "Assets Published", value: "28", change: "Same", trendingUp: true, icon: FileText, color: "#F59E0B" },
    { name: "Keyword Growth", value: "+142", change: "+24%", trendingUp: true, icon: TrendingUp, color: "#8B5CF6" },
];

const recentContent = [
    { title: "10 SEO Tips for Small Businesses", status: "Published", date: "2 hours ago", score: 92 },
    { title: "How AI is Changing Content Marketing", status: "Scheduled", date: "Tomorrow, 10:00 AM", score: 88 },
    { title: "Scaling Your SaaS with Programmatic SEO", status: "Draft", date: "Modified 5 hours ago", score: 76 },
];

export default function DashboardPulse() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Hero Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">The <span className="text-[#3B82F6] italic">Pulse</span></h1>
                    <p className="text-slate-400 mt-2">Here's how your content strategy is performing today.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3B82F6] text-white font-bold shadow-lg shadow-[#3B82F6]/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center">
                    <Plus size={20} />
                    Create New Asset
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-dark p-6 rounded-3xl border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <stat.icon size={64} style={{ color: stat.color }} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400">
                                <stat.icon size={20} />
                            </div>
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.name}</span>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-black">{stat.value}</span>
                            <div className={`flex items-center text-xs font-bold mb-1.5 ${stat.trendingUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {stat.trendingUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Stats & Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Performance Chart (M1.3) */}
                <div className="lg:col-span-2 glass-dark p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold">Performance Trend</h3>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Organic Traffic • Last 30 Days</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold">
                                <TrendingUp size={14} />
                                +12.5% vs Last Mo
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[220px] relative mt-4">
                        <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <line x1="0" y1="0" x2="800" y2="0" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                            <line x1="0" y1="73" x2="800" y2="73" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                            <line x1="0" y1="146" x2="800" y2="146" stroke="white" strokeOpacity="0.05" strokeWidth="1" />

                            <path
                                d="M0,200 Q100,180 200,120 T400,140 T600,60 T800,40 L800,220 L0,220 Z"
                                fill="url(#chartGradient)"
                            />
                            <path
                                d="M0,200 Q100,180 200,120 T400,140 T600,60 T800,40"
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                            <circle cx="200" cy="120" r="4" fill="#3B82F6" />
                            <circle cx="400" cy="140" r="4" fill="#3B82F6" />
                            <circle cx="600" cy="60" r="4" fill="#3B82F6" />
                            <circle cx="800" cy="40" r="6" fill="#3B82F6" stroke="white" strokeWidth="2" />
                        </svg>

                        <div className="absolute top-0 right-0 pointer-events-none">
                            <div className="bg-[#3B82F6] text-white px-3 py-1.5 rounded-lg text-[10px] font-black shadow-xl shadow-[#3B82F6]/30 translate-x-4 -translate-y-4">
                                CURRENT PEAK: 12,450
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                        {['Feb 01', 'Feb 08', 'Feb 15', 'Feb 22', 'Today'].map((label, i) => (
                            <span key={i} className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
                        ))}
                    </div>
                </div>

                {/* Automation Status Card */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Strategy Health</h3>
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-[#3B82F6]/10 to-transparent relative overflow-hidden h-full flex flex-col">
                        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#3B82F6]/20 blur-3xl animate-pulse"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-14 w-14 rounded-2xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <div className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Engine Status</div>
                                <div className="text-2xl font-black text-emerald-400">All Systems Go</div>
                            </div>
                        </div>

                        <ul className="space-y-4 flex-1">
                            {[
                                { label: "Website Crawl", status: "Healthy", icon: Globe },
                                { label: "Brand Voice Fixation", status: "Locked", icon: Bot },
                                { label: "WordPress Pipeline", status: "Connected", icon: Youtube },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-crosshair">
                                    <item.icon size={18} className="text-slate-400" />
                                    <span className="text-sm font-semibold flex-1">{item.label}</span>
                                    <span className="text-xs font-black uppercase text-emerald-400">{item.status}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="w-full mt-8 py-4 rounded-2xl border border-[#3B82F6]/50 text-[#3B82F6] font-bold hover:bg-[#3B82F6] hover:text-white transition-all">
                            Run Full Audit
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Content Table */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Recent Activity</h3>
                        <button className="text-sm font-semibold text-[#3B82F6] hover:underline">View All</button>
                    </div>
                    <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden">
                        <div className="divide-y divide-white/5">
                            {recentContent.map((item, i) => (
                                <div key={i} className="p-6 flex items-center gap-6 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${item.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400' :
                                            item.status === 'Scheduled' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-slate-500/10 text-slate-400'
                                        }`}>
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-lg truncate group-hover:text-[#3B82F6] transition-colors">{item.title}</h4>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.status}</span>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                <Clock size={12} />
                                                {item.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-500 mb-1">SEO Score</div>
                                        <div className={`text-xl font-black ${item.score > 85 ? 'text-emerald-400' : 'text-emerald-400/60'}`}>
                                            {item.score}<span className="text-xs text-slate-600">/100</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Keyword Opportunities Snippet */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Top Keyword Opportunities</h3>
                        <button className="text-sm font-semibold text-[#3B82F6] hover:underline">Full Analysis</button>
                    </div>
                    <div className="glass-dark rounded-3xl border border-white/5 overflow-hidden divide-y divide-white/5">
                        {[
                            { keyword: "best legal consulting for startups", volume: "1.2k", difficulty: "Low" },
                            { keyword: "how to scale law firm automation", volume: "850", difficulty: "Med" },
                            { keyword: "business compliance checklist 2026", volume: "3.4k", difficulty: "Low" },
                        ].map((kw, i) => (
                            <div key={i} className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[#3B82F6]">
                                        <TrendingUp size={16} />
                                    </div>
                                    <span className="font-bold group-hover:text-[#3B82F6] transition-colors">{kw.keyword}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-600 uppercase">Volume</div>
                                        <div className="text-sm font-black">{kw.volume}</div>
                                    </div>
                                    <div className="text-right min-w-[60px]">
                                        <div className="text-[10px] font-black text-slate-600 uppercase">Difficulty</div>
                                        <div className={`text-sm font-black ${kw.difficulty === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>{kw.difficulty}</div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

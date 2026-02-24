"use client";

import { motion } from "framer-motion";
import {
    Globe,
    Link as LinkIcon,
    ShieldCheck,
    RefreshCw,
    ExternalLink,
    ChevronRight,
    Save
} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight">Integrations & <span className="text-[#3B82F6] italic">Settings</span></h1>
                <p className="text-slate-400 mt-2">Connect your publishing pipelines and manage your brand profile.</p>
            </div>

            <div className="grid gap-8">
                {/* WordPress Integration Card */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-[#3B82F6]/5 to-transparent relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white text-[#21759b] flex items-center justify-center shadow-lg">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365a10 10 0 005.626-1.737c-.015-.022-.03-.046-.041-.072l-5.427-6.396zm8.88-1.554c.08-.415.122-.843.122-1.28 0-1.792-.644-3.528-1.745-4.78.14.636.19 1.343.19 2.11 0 1.25-.436 2.875-1.12 4.604l-1.635 4.717 1.83 5.403a9.96 9.96 0 002.358-10.774zM12 2a10 10 0 00-4.66.9c.142.015.275.025.39.025 1.12 0 2.87-.436 2.87-.436 0 0 .19 1.41.22 1.41.524 0 1.107-.152 1.67-.152 1.25 0 2.455.45 2.41 1.764-.04 1.16-.76 2.39-1.205 3.528-.445 1.13-.804 2.156-.804 2.89 0 .805.513 1.41 1.26 1.41s1.378-.65 1.378-1.41c0-.505-.18-.946-.18-.946l2.365 6.703A9.957 9.957 0 0021.923 11c-.017-1.107-.63-2.022-.614-3.13.012-1.077.5-1.93.5-3.007 0-1.423-.46-2.456-1.16-3.13a10.02 10.02 0 00-8.65-1.733zM9.54 11.23c0-.603.22-1.173.22-2.14 0-1.004-.334-1.842-.334-2.847 0-1.14.837-1.493 1.63-1.493 1.12 0 2.307.726 2.307 2.307 0 1.125-.837 1.84-1.256 2.846-.42 1.005-.445 1.73-.445 2.12a.965.965 0 00.978.966c.86 0 1.435-.49 1.435-1.15s-.222-1.09-.222-1.09l4.57 12.01c.214-.23.414-.473.6-.723L13.78 6.556c.41-1.15.82-2.31.82-3.14 0-1.026-.513-1.633-1.26-1.633-.77 0-1.41.65-1.41 1.424 0 .504.18.946.18.946l-2.57 7.077zM2 12a10 10 0 0017.65 6.347l-4.57-12.01c-.13-.012-.24-.025-.338-.025-1.12 0-2.834.436-2.834.436 0 0-.012-1.41-.04-1.41.52 0 1.107.152 1.67.152.62 0 1.227-.11 1.76-.297a10.05 10.05 0 00-13.31 6.81z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">WordPress Publishing</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Not Connected</span>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
                            Documentation <ExternalLink size={14} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Site URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="text"
                                        placeholder="https://your-blog.com"
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/20 border border-white/5 focus:border-[#3B82F6] outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400">Application Password</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input
                                        type="password"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-black/20 border border-white/5 focus:border-[#3B82F6] outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#3B82F6]/5 border border-[#3B82F6]/10 text-sm text-slate-400 leading-relaxed">
                            <p><strong>Note:</strong> You must use a <span className="text-white italic">WordPress Application Password</span>. Do not use your primary admin password. You can find this under Users → Profile in your WordPress dashboard.</p>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 h-12 rounded-xl bg-[#3B82F6] text-white font-bold shadow-lg shadow-[#3B82F6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <Save size={18} />
                                Save Connection
                            </button>
                            <button className="px-6 h-12 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                <RefreshCw size={18} />
                                Test
                            </button>
                        </div>
                    </div>
                </div>

                {/* Google Search Console Card */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                                <svg width="32" height="32" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.83c.87-2.6 3.3-4.51 6.16-4.51z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Search Console Analytics</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-2 w-2 rounded-full bg-[#10B981]"></div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#10B981]">Connected (oliver@legal.com)</span>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:text-white transition-all text-slate-400">
                            Disconnect <RefreshCw size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-400">Tracking Property</span>
                            <span className="text-sm font-bold">legalgrowth.co</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-400">Last Sync</span>
                            <span className="text-sm font-bold">14 mins ago</span>
                        </div>
                    </div>
                </div>

                {/* Automation Rules */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-6">Automation Pilot</h3>
                    <div className="space-y-4">
                        {[
                            { name: "Auto-Research", desc: "Discover 3 new high-intent keywords daily.", active: true },
                            { name: "Draft Generation", desc: "Automatically create content briefs for new keywords.", active: true },
                            { name: "Publishing Schedule", desc: "Sync approved drafts to WordPress at peak times.", active: false },
                        ].map((rule, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-[#3B82F6]/30 transition-all">
                                <div>
                                    <div className="font-bold">{rule.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{rule.desc}</div>
                                </div>
                                <button className={`
                                    h-7 w-12 rounded-full p-1 transition-all
                                    ${rule.active ? 'bg-[#3B82F6]' : 'bg-slate-700'}
                                `}>
                                    <div className={`h-5 w-5 rounded-full bg-white transition-all ${rule.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

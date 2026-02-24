"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Check,
    Zap,
    ShieldCheck,
    CreditCard,
    ArrowUpRight,
    BarChart3,
    Globe,
    Bot,
    Plus,
    History as LucideHistory,
    Download,
    FileText
} from "lucide-react";



export default function BillingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

    const plans = [
        {
            name: "Starter",
            price: billingCycle === "monthly" ? "99" : "79",
            description: "Perfect for solo entrepreneurs scaling their first niche site.",
            features: [
                "10 Discoveries / Month",
                "5 Forge AI Drafts",
                "Basic WordPress Sync",
                "7-Day Research Buffer",
                "Community Support"
            ],
            cta: "Current Plan",
            current: true,
            color: "#64748B"
        },
        {
            name: "Scale",
            price: billingCycle === "monthly" ? "249" : "199",
            description: "Ideal for growth agencies managing multiple portfolios.",
            features: [
                "50 Discoveries / Month",
                "25 Forge AI Drafts",
                "Advanced WP + Social Sync",
                "Daily Automation Cron",
                "Brand Voice Fixation (2 Profiles)",
                "Priority AI Support"
            ],
            cta: "Upgrade to Scale",
            current: false,
            popular: true,
            color: "#3B82F6"
        },
        {
            name: "Dominance",
            price: billingCycle === "monthly" ? "599" : "479",
            description: "Full-scale SEO engine for established content empires.",
            features: [
                "Unlimited Discoveries",
                "Unlimited Forge AI Drafts",
                "Enterprise Custom Integrations",
                "Real-time Crawler Access",
                "Unlimited Brand Profiles",
                "Dedicated SEO Strategist"
            ],
            cta: "Contact Sales",
            current: false,
            color: "#8B5CF6"
        }
    ];

    const history = [
        { id: "INV-2026-001", date: "Feb 01, 2026", amount: "$99.00", status: "Paid" },
        { id: "INV-2026-002", date: "Jan 01, 2026", amount: "$99.00", status: "Paid" },
        { id: "INV-2025-012", date: "Dec 01, 2025", amount: "$99.00", status: "Paid" },
    ];

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black tracking-tight">Fuel Your <span className="text-[#3B82F6] italic">SEO Engine</span></h1>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Choose the power level your content empire needs. Switch plans anytime as you scale.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center pt-4">
                    <div className="glass-dark p-1 rounded-2xl border border-white/5 flex items-center gap-1">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("annually")}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'annually' ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            Annually
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">-20%</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`
                            glass-dark p-8 rounded-3xl border relative overflow-hidden flex flex-col
                            ${plan.popular ? 'border-[#3B82F6] shadow-2xl shadow-[#3B82F6]/10' : 'border-white/5'}
                        `}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0">
                                <div className="bg-[#3B82F6] text-white text-[10px] font-black uppercase tracking-widest px-8 py-2 rotate-45 translate-x-10 translate-y-2">
                                    Most Popular
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-black">${plan.price}</span>
                                <span className="text-slate-500 font-bold mb-1.5 uppercase text-xs tracking-widest">/ Month</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed min-h-[40px]">
                                {plan.description}
                            </p>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map((feature, j) => (
                                <div key={j} className="flex items-center gap-3">
                                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-300">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button className={`
                            w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase transition-all
                            ${plan.current
                                ? 'bg-white/5 text-slate-500 cursor-default cursor-not-allowed'
                                : plan.popular
                                    ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'}
                        `}>
                            {plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Section: Card Management & Invoices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Method Management */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-[#3B82F6]/5 to-transparent flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                                <CreditCard size={20} />
                            </div>
                            <h3 className="text-xl font-bold">Payment Method</h3>
                        </div>
                        <button className="text-xs font-black uppercase text-[#3B82F6] hover:underline">Update</button>
                    </div>

                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-16 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
                                <span className="font-black italic text-slate-500">VISA</span>
                            </div>
                            <div>
                                <div className="font-bold flex items-center gap-2">
                                    •••• •••• •••• 4242
                                    <div className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full">Primary</div>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Expires 12/28</div>
                            </div>
                        </div>
                        <ArrowUpRight size={20} className="text-slate-700 group-hover:text-white transition-all" />
                    </div>

                    <div className="mt-8 p-6 rounded-2xl border border-dashed border-white/10 flex items-center justify-center gap-3 text-slate-500 hover:text-white hover:border-white/20 transition-all cursor-pointer group">
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="font-bold">Add Backup Method</span>
                    </div>
                </div>

                {/* Invoices */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
                                <LucideHistory size={20} />
                            </div>

                            <h3 className="text-xl font-bold">Billing History</h3>
                        </div>
                        <button className="text-xs font-black uppercase text-[#3B82F6] hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {history.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/[0.02] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="text-slate-500">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold">{inv.id}</div>
                                        <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{inv.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-black text-sm">{inv.amount}</span>
                                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Compliance Banner */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 opacity-40">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <ShieldCheck size={16} />
                    SECURE 256-BIT SSL ENCRYPTION
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <BarChart3 size={16} />
                    REAL-TIME USAGE TRACKING
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Globe size={16} />
                    PCI DSS COMPLIANT
                </div>
            </div>
        </div>
    );
}

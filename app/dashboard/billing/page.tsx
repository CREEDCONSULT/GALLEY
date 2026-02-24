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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePlanClick = (plan: any) => {
        if (plan.current) return;
        setSelectedPlan(plan);
        setIsCheckoutOpen(true);
    };

    const handleProcessPayment = () => {
        setIsProcessing(true);
        // Simulate premium processing delay
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsCheckoutOpen(false);
                setIsSuccess(false);
            }, 3000);
        }, 2000);
    };

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

                        <button 
                            onClick={() => handlePlanClick(plan)}
                            className={`
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
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">Payment Methods</h3>
                                <p className="text-xs text-slate-500 mt-1">Manage your cards and billing info</p>
                            </div>
                        </div>
                        <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                            <Plus size={18} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-[#3B82F6]/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-14 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center font-bold italic text-slate-400">
                                    VISA
                                </div>
                                <div>
                                    <p className="text-sm font-bold">•••• •••• •••• 4242</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Expires 12/28 • Default</p>
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-full flex items-center justify-center text-slate-600 group-hover:text-emerald-400 transition-all">
                                <ShieldCheck size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing History */}
                <div className="glass-dark p-8 rounded-3xl border border-white/5 flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <LucideHistory size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Billing History</h3>
                            <p className="text-xs text-slate-500 mt-1">Access and download your past invoices</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {[
                            { id: "INV-2025-003", date: "Feb 1, 2026", amount: "$199.00", status: "Paid" },
                            { id: "INV-2025-002", date: "Jan 1, 2026", amount: "$199.00", status: "Paid" },
                        ].map((inv) => (
                            <div key={inv.id} className="p-4 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between group border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-white transition-all">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{inv.id}</p>
                                        <p className="text-[10px] text-slate-500 mt-1">{inv.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-black tracking-tight">{inv.amount}</span>
                                    <button className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#3B82F6] transition-all">
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        onClick={() => !isProcessing && setIsCheckoutOpen(false)}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="glass-dark w-full max-w-lg rounded-[2.5rem] border border-white/10 overflow-hidden relative"
                    >
                        {!isSuccess ? (
                            <div className="p-8 sm:p-12">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black mb-2">Complete Checkout</h2>
                                        <p className="text-sm text-slate-500">Secure 256-bit encrypted payment</p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                                        <Zap size={28} />
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 mb-8">
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Plan Selection</span>
                                        <span className="font-black text-[#3B82F6]">{selectedPlan?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Total due now</span>
                                        <span className="text-2xl font-black">${selectedPlan?.price}</span>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Card Number</label>
                                        <div className="h-14 bg-slate-950/50 rounded-2xl border border-white/5 flex items-center px-5 gap-4 group focus-within:border-[#3B82F6]/50 transition-all">
                                            <CreditCard size={20} className="text-slate-600 group-focus-within:text-[#3B82F6]" />
                                            <input type="text" placeholder="4242 4242 4242 4242" className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-700 font-medium" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Expiry</label>
                                            <input type="text" placeholder="MM / YY" className="h-14 bg-slate-950/50 rounded-2xl border border-white/5 px-5 text-white w-full placeholder:text-slate-700 font-medium focus:border-[#3B82F6]/50 focus:ring-0 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">CVC</label>
                                            <input type="text" placeholder="•••" className="h-14 bg-slate-950/50 rounded-2xl border border-white/5 px-5 text-white w-full placeholder:text-slate-700 font-medium focus:border-[#3B82F6]/50 focus:ring-0 transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-[#3B82F6] text-white h-16 rounded-[1.25rem] font-black tracking-widest uppercase shadow-xl shadow-[#3B82F6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Confirm & Pay ${selectedPlan?.price}
                                        </>
                                    )}
                                </button>
                                
                                <p className="text-center text-[10px] text-slate-600 mt-6 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <ShieldCheck size={12} className="text-emerald-500" />
                                    Secure Stripe Checkout
                                </p>
                            </div>
                        ) : (
                            <div className="p-12 text-center py-20">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 10 }}
                                    className="h-24 w-24 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20"
                                >
                                    <Check size={48} strokeWidth={3} />
                                </motion.div>
                                <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Payment Successful</h2>
                                <p className="text-slate-400 font-medium">Your account has been upgraded to <span className="text-white font-bold">{selectedPlan?.name}</span>.</p>
                                <p className="text-slate-500 text-sm mt-8 animate-pulse">Redirecting to dashboard...</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

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

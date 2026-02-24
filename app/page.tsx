"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Zap,
  TrendingUp,
  ShieldCheck,
  BarChart3,
  PenTool,
  Globe,
  Check,
  FileText,
  Search,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const features = [
    {
      icon: <Search className="text-[#3B82F6]" />,
      title: "Self-Driving Research",
      description: "Our AI agent crawls your site and competitors to find high-intent keyword gaps automatically."
    },
    {
      icon: <PenTool className="text-emerald-400" />,
      title: "Brand Voice Cloning",
      description: "We analyze your top-performing posts to replicate your unique tone, sentence structure, and vocabulary."
    },
    {
      icon: <Globe className="text-[#3B82F6]" />,
      title: "Direct WP Sync",
      description: "Approve content in one click and watch it publish directly to your WordPress site with SEO metadata."
    },
    {
      icon: <BarChart3 className="text-emerald-400" />,
      title: "GSC Health Pulse",
      description: "Real-time tracking of impressions and clicks for every asset we publish for you."
    }
  ];

  const plans = [
    {
      name: "Starter",
      description: "Perfect for local service businesses.",
      monthlyPrice: 99,
      annualPrice: 79,
      features: ["4 Articles / Month", "Keyword Research", "WP Integration", "Basic Analytics"],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Growth",
      description: "The sweet spot for scaling SaaS.",
      monthlyPrice: 199,
      annualPrice: 159,
      features: ["12 Articles / Month", "Priority Research", "Brand Voice Cloning", "SEO scoring"],
      cta: "Get Started",
      popular: true
    },
    {
      name: "Agency",
      description: "Volume for competitive industries.",
      monthlyPrice: 499,
      annualPrice: 399,
      features: ["30 Articles / Month", "Strategic Advisory", "Custom Workflows", "White-label reports"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0B1120] text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full glass border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/20 group-hover:scale-110 transition-transform">
              <Bot className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">ContentFlow <span className="text-[#3B82F6] italic">AI</span></span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#samples" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Samples</a>
            <a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <Link
            href="/onboarding"
            className="rounded-full bg-[#3B82F6] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#3B82F6]/20 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center">
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
          {/* Animated Background Orbs */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#3B82F6]/20 blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[128px]" />

          <div className="z-10 mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/20 bg-[#3B82F6]/5 px-4 py-1.5 text-sm font-medium text-[#3B82F6]"
            >
              <Zap size={14} className="fill-current" />
              <span>Powering 500+ Organic Strategies</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl"
            >
              Rank Higher <br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-emerald-400 to-[#3B82F6] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                While You Sleep
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-12 max-w-2xl text-lg text-slate-400 sm:text-xl lg:text-2xl"
            >
              The automated SEO engine that researches, writes, and publishes
              high-authority content in your unique brand voice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/onboarding"
                className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#3B82F6] px-10 text-lg font-bold text-white shadow-xl shadow-[#3B82F6]/30 hover:scale-[1.02] active:scale-[0.98] transition-all sm:w-auto"
              >
                Start Free Audit
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#samples"
                className="h-16 w-full flex items-center justify-center rounded-2xl glass-dark px-10 text-lg font-semibold border border-white/5 hover:border-[#3B82F6]/40 transition-all sm:w-auto"
              >
                View Sample Assets
              </a>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-7xl px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black mb-4 sm:text-5xl">Automate Your <span className="text-[#3B82F6]">SEO Moat</span></h2>
            <p className="text-slate-500 max-w-xl mx-auto italic font-medium">Zero-prompt content production for aggressive growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark p-8 rounded-[2rem] border border-white/5 hover:border-[#3B82F6]/30 transition-all group"
              >
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Sample Assets Section */}
        <section id="samples" className="w-full bg-white/[0.02] py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                  <Sparkles size={12} />
                  Live Samples
                </div>
                <h2 className="text-4xl sm:text-6xl font-black leading-tight">Content that looks and <span className="text-[#3B82F6] italic">feels</span> human.</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Our Forge AI doesn't just generate text. It constructs deep-dive assets with H-tags, meta-data, and semantic density that search engines adore.
                </p>
                <div className="space-y-4">
                  {[
                    "80+ Avg Performance Score",
                    "Plagiarism-free guaranteed",
                    "Synthesized from your brand DNA"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 font-bold text-sm">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check size={12} />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 w-full">
                <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                  <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-6 gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="h-4 w-1/3 bg-[#3B82F6]/20 rounded-full" />
                    <div className="h-10 w-full bg-white/5 rounded-xl" />
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-white/5 rounded-full" />
                      <div className="h-4 w-full bg-white/5 rounded-full" />
                      <div className="h-4 w-2/3 bg-white/5 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
                      <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-7xl px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black mb-6 sm:text-5xl">Scale Your <span className="text-[#3B82F6]">Velocity</span></h2>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
                className="h-8 w-14 rounded-full bg-white/5 border border-white/10 p-1 relative"
              >
                <div className={`h-full aspect-square bg-[#3B82F6] rounded-full transition-all duration-300 ${billingCycle === 'annually' ? 'ml-6' : 'ml-0'}`} />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${billingCycle === 'annually' ? 'text-white' : 'text-slate-500'}`}>Annually</span>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase tracking-tighter">Save 20%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`
                  glass-dark p-8 rounded-[2.5rem] border relative flex flex-col
                  ${plan.popular ? 'border-[#3B82F6] shadow-2xl shadow-[#3B82F6]/10' : 'border-white/5'}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-8">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl font-black">${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}</span>
                  <span className="text-slate-500 font-bold">/mo</span>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feat, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>

                <Link
                  href="/onboarding"
                  className={`
                    w-full py-4 rounded-2xl text-center font-black tracking-widest uppercase transition-all
                    ${plan.popular ? 'bg-[#3B82F6] text-white shadow-xl shadow-[#3B82F6]/20' : 'bg-white text-black hover:bg-slate-100'}
                  `}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full max-w-5xl mx-auto px-6 py-32">
          <div className="glass-dark p-12 sm:p-20 rounded-[3rem] border border-[#3B82F6]/20 bg-gradient-to-br from-[#3B82F6]/10 to-transparent text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Bot size={200} />
            </div>
            <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">Ready to let AI handle <br /> the heavy lifting?</h2>
            <Link
              href="/onboarding"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-2xl bg-[#3B82F6] px-12 text-lg font-bold text-white shadow-2xl shadow-[#3B82F6]/30 hover:scale-[1.05] active:scale-95 transition-all"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
            <p className="mt-8 text-slate-500 font-medium">No credit card required for audit. 14-day free trial.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] group-hover:scale-110 transition-transform">
              <Bot size={18} />
            </div>
            <span className="font-bold tracking-tight">ContentFlow AI</span>
          </Link>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">
            © 2026 ContentFlow AI. All rights Reserved.
          </div>
          <div className="flex gap-6 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <Link href="#">Terms</Link>
            <Link href="#">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

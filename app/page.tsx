"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Zap, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full glass border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Bot className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">ContentFlow <span className="text-primary italic">AI</span></span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          </div>
          <Link
            href="/onboarding"
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 pt-32 pb-20">
        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#10B981]/10 blur-[128px]" />

        <div className="z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Zap size={14} className="fill-current" />
            <span>Powering 500+ Organic Strategies</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl"
          >
            Rank Higher <br />
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
              While You Sleep
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-slate sm:text-xl lg:text-2xl"
          >
            The automated SEO engine that researches, writes, and publishes
            high-authority content in your unique brand voice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/onboarding"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-lg font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all sm:w-auto"
            >
              Start Your Free Audit
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="h-14 w-full rounded-2xl glass-dark px-8 text-lg font-semibold hover:border-primary/50 transition-colors sm:w-auto">
              View Sample Assets
            </button>
          </motion.div>
        </div>

        {/* Floating Feature Tags */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {[
            { icon: <TrendingUp size={18} />, text: "Automated GSC Sync" },
            { icon: <Bot size={18} />, text: "Brand Voice Cloning" },
            { icon: <ShieldCheck size={18} />, text: "Plagiarism-Free" },
            { icon: <Zap size={18} />, text: "WP Direct Publish" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
              className="flex items-center gap-3 glass p-4 rounded-2xl"
            >
              <div className="text-primary">{item.icon}</div>
              <span className="text-sm font-semibold tracking-wide">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

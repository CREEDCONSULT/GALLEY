"use client";

import { Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Progress Header */}
            <header className="glass border-b border-white/10 px-6 py-4 fixed top-0 w-full z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <Bot className="text-white" size={18} />
                        </div>
                        <span className="font-bold tracking-tight">ContentFlow <span className="text-primary italic">AI</span></span>
                    </Link>

                    <div className="flex items-center gap-4 text-xs font-semibold text-slate uppercase tracking-wider">
                        <span>Step 1: Business</span>
                        <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-1/3 transition-all duration-500" />
                        </div>
                        <span>Step 2: Voice</span>
                        <div className="h-1 w-12 bg-white/10 rounded-full" />
                        <span>Step 3: Pulse</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
                {children}
            </main>
        </div>
    );
}

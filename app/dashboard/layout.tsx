"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    PenTool,
    Target,
    Settings,
    LogOut,
    Bot,
    Search,
    Bell,
    User,
    Zap,
    CreditCard
} from "lucide-react";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const sidebarLinks = [
    { name: "Pulse", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Forge", href: "/dashboard/forge", icon: PenTool },
    { name: "Keywords", href: "/dashboard/keywords", icon: Target },
    { name: "Automation", href: "/dashboard/automation", icon: Zap },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-[#0F172A] text-white overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                    border-r border-white/5 bg-white/[0.02] backdrop-blur-xl
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="p-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/20 group-hover:scale-110 transition-transform">
                                <Bot className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                ContentFlow <span className="text-[#3B82F6] italic">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                        ${isActive
                                            ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/20"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"}
                                    `}
                                >
                                    <link.icon size={20} className={isActive ? "text-white" : "group-hover:text-[#3B82F6] transition-colors"} />
                                    <span className="font-semibold">{link.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-white/5 space-y-2">
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Settings size={20} />
                            <span className="font-semibold">Settings</span>
                        </Link>
                        <button
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                            <LogOut size={20} />
                            <span className="font-semibold">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-18 flex items-center justify-between px-8 border-b border-white/5 bg-white/[0.01] backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-full max-w-md hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search content assets..."
                                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/5 focus:border-[#3B82F6] outline-none transition-all text-sm placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#3B82F6]"></span>
                        </button>
                        <div className="h-10 px-3 flex items-center gap-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#3B82F6] to-emerald-400 flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-bold hidden sm:block">Oliver</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {children}
                </main>
            </div>

            {/* Global Styles for Scrollbar */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}

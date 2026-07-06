"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardCheck,
  FileUp,
  Fingerprint,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { SignOutButton } from "@/components/galley/SignOutButton";

const navigation = [
  { name: "Proof queue", href: "/dashboard/proof", icon: ClipboardCheck },
  { name: "Submit draft", href: "/dashboard/intake", icon: FileUp },
  { name: "Playbooks", href: "/onboarding", icon: BookOpen },
  { name: "Records", href: "/dashboard/records", icon: Fingerprint },
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground md:grid md:grid-cols-[16rem_1fr]">
      <aside className="hidden min-h-screen border-r border-border bg-[#0d0d0c] md:sticky md:top-0 md:flex md:h-screen md:flex-col">
        <div className="border-b border-border p-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-primary/70 font-mono text-sm text-primary">G</span>
            <div>
              <span className="block font-semibold tracking-[-0.02em]">Galley</span>
              <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-widest text-slate">Proof before press.</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4" aria-label="Workspace navigation">
          <p className="mb-3 px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-slate">Workspace</p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.name} href={item.href} className={`flex items-center gap-3 border px-3 py-3 text-sm transition-colors ${active ? "border-border-strong bg-surface-raised text-foreground" : "border-transparent text-muted hover:border-border hover:text-foreground"}`}>
                  <item.icon size={17} strokeWidth={1.6} className={active ? "text-primary" : "text-slate"} />
                  {item.name}
                  {active && <span className="ml-auto h-1.5 w-1.5 bg-primary" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-border p-4">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-3 text-sm text-muted transition-colors hover:text-foreground">
            <Settings size={17} /> Settings
          </Link>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex min-h-18 items-center justify-between gap-4 px-5 md:px-8 lg:px-10">
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <span className="flex h-8 w-8 items-center justify-center border border-primary/70 font-mono text-xs text-primary">G</span>
              <span className="font-semibold">Galley</span>
            </Link>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Northline Studio</p>
              <p className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-slate">Agency workspace</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center gap-2 border border-success/30 bg-success/5 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-success sm:flex">
                <ShieldCheck size={13} /> Human gate active
              </div>
              <div className="flex h-9 w-9 items-center justify-center border border-border bg-surface font-mono text-[10px] text-ink-soft">NS</div>
            </div>
          </div>
          <nav className="flex overflow-x-auto border-t border-border px-5 md:hidden" aria-label="Mobile workspace navigation">
            {navigation.map((item) => {
              const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
              return <Link key={item.name} href={item.href} className={`shrink-0 border-b-2 px-4 py-3 text-xs ${active ? "border-primary text-foreground" : "border-transparent text-muted"}`}>{item.name}</Link>;
            })}
          </nav>
        </header>
        <main className="p-5 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

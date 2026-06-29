import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background px-5 md:px-10">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Galley home">
            <span className="flex h-9 w-9 items-center justify-center border border-primary/70 font-mono text-sm text-primary">G</span>
            <span className="text-lg font-semibold tracking-[-0.02em]">Galley</span>
          </Link>
          <span className="eyebrow">Client playbook setup</span>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

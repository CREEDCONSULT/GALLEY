export const dynamic = "force-dynamic";

import type { ComponentProps } from "react";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { login } from "./action";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="rule-grid flex min-h-screen items-center justify-center bg-background p-5 text-foreground">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-primary/70 font-mono text-sm text-primary">G</span>
          <div>
            <p className="font-semibold">Galley</p>
            <p className="font-mono text-[9px] uppercase tracking-widest text-slate">Proof before press.</p>
          </div>
        </Link>

        <div className="border border-border bg-surface p-7 shadow-[12px_12px_0_0_#0b0b0a] md:p-9">
          <div className="border-b border-border pb-6">
            <p className="eyebrow">Workspace access</p>
            <h1 className="editorial-display mt-3 text-4xl">Welcome back.</h1>
            <p className="mt-3 text-sm leading-6 text-muted">Enter your email and we’ll send a secure sign-in link.</p>
          </div>

          <form action={login} className="mt-6 space-y-5">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={16} />
              <Input id="email" name="email" type="email" placeholder="name@agency.com" required className="pl-10" />
            </div>
            <Button type="submit">
              Send secure link <ArrowRight size={15} />
            </Button>
            {params.message && <p className="border border-success/35 bg-success/5 p-3 text-center text-sm text-success">{params.message}</p>}
            {params.error && <p className="border border-danger/35 bg-danger/5 p-3 text-center text-sm text-danger">{params.error}</p>}
          </form>

          <div className="mt-7 flex items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-slate">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-primary" />
            Access to client playbooks and proof records is tied to your workspace identity.
          </div>
        </div>
      </div>
    </div>
  );
}

function Label(props: ComponentProps<"label">) {
  return <label {...props} className={`block text-sm font-medium text-ink-soft ${props.className ?? ""}`} />;
}

function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`h-12 w-full border border-border bg-[#0d0d0c] px-3 text-sm text-foreground outline-none placeholder:text-slate focus:border-primary ${props.className ?? ""}`} />;
}

function Button(props: ComponentProps<"button">) {
  return <button {...props} className={`flex h-12 w-full items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-background transition-colors hover:bg-primary-strong ${props.className ?? ""}`} />;
}

"use client";

import { type ComponentProps, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    formData.set("flow", flow);
    try {
      await signIn("password", formData);
      router.push("/dashboard/proof");
    } catch {
      setError(
        flow === "signIn"
          ? "Could not sign in. Check your email and password."
          : "Could not create the account. Passwords must be at least 8 characters.",
      );
      setPending(false);
    }
  };

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
            <h1 className="editorial-display mt-3 text-4xl">
              {flow === "signIn" ? "Welcome back." : "Create your workspace."}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              {flow === "signIn"
                ? "Sign in to review the proof queue and make attributable decisions."
                : "Your name is recorded on every proof decision you make."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            {flow === "signUp" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={16} />
                  <Input id="name" name="name" type="text" placeholder="Dana Reyes" required className="pl-10" />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={16} />
                <Input id="email" name="email" type="email" placeholder="name@agency.com" required className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate" size={16} />
                <Input id="password" name="password" type="password" placeholder="At least 8 characters" required minLength={8} className="pl-10" />
              </div>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Working…" : flow === "signIn" ? "Sign in" : "Create workspace"}
              <ArrowRight size={15} />
            </Button>
            {error && <p className="border border-danger/35 bg-danger/5 p-3 text-center text-sm text-danger">{error}</p>}
          </form>

          <button
            type="button"
            onClick={() => { setFlow(flow === "signIn" ? "signUp" : "signIn"); setError(""); }}
            className="mt-5 w-full text-center text-xs text-slate transition-colors hover:text-foreground"
          >
            {flow === "signIn" ? "No workspace yet? Create one." : "Already have a workspace? Sign in."}
          </button>

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
  return <button {...props} className={`flex h-12 w-full items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-background transition-colors hover:bg-primary-strong disabled:opacity-50 ${props.className ?? ""}`} />;
}

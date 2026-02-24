export const dynamic = "force-dynamic";

import { login } from './action'
import { Mail } from 'lucide-react'


// Note: I'll need to create basic UI components since shadcn might not be fully present
// or I'll just use standard Tailwind for now to ensure it works.

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string; error: string }
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A] p-4 text-white">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-[#3B82F6]">ContentFlow AI</h1>
                    <p className="mt-2 text-slate-400">Rank higher while you sleep.</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                    <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#3B82F6]/20 blur-3xl"></div>

                    <form action={login} className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">Welcome Back</h2>
                            <p className="text-sm text-slate-400">Enter your email to receive a magic link.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        className="border-white/10 bg-black/20 pl-10 text-white placeholder:text-slate-600 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-[#3B82F6] font-semibold hover:bg-[#2563EB]">
                                Send Magic Link
                            </Button>
                        </div>

                        {searchParams?.message && (
                            <p className="rounded-lg bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-400">
                                {searchParams.message}
                            </p>
                        )}

                        {searchParams?.error && (
                            <p className="rounded-lg bg-rose-500/10 p-3 text-center text-sm font-medium text-rose-400">
                                {searchParams.error}
                            </p>
                        )}
                    </form>

                    <div className="mt-8 text-center text-xs text-slate-500">
                        By signing in, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}

// Minimalist UI components to replace missing shadcn/ui internal dependencies
function Label({ children, className, ...props }: any) {
    return <label className={`block text-sm font-medium text-slate-300 ${className}`} {...props}>{children}</label>
}

function Input({ className, ...props }: any) {
    return <input className={`flex h-11 w-full rounded-lg border px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
}

function Button({ children, className, ...props }: any) {
    return <button className={`flex h-11 items-center justify-center rounded-lg px-4 py-2 transition-all active:scale-95 disabled:opacity-50 ${className}`} {...props}>{children}</button>
}

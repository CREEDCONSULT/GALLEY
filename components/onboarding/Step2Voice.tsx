"use client";

import { motion } from "framer-motion";
import { Mic2, MessageSquare, Shield, Smile, ArrowLeft, ArrowRight } from "lucide-react";

const voices = [
    { id: "authoritative", name: "Authoritative", icon: <Shield />, desc: "Expert, confident, and research-backed." },
    { id: "friendly", name: "Friendly", icon: <Smile />, desc: "Warm, relatable, and community-focused." },
    { id: "insider", name: "Insider", icon: <Mic2 />, desc: "Trend-driven, witty, and behind-the-scenes." },
];

export default function Step2Voice({ data, setData, next, prev }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Define Your <span className="text-primary italic">Voice</span></h2>
                <p className="text-slate italic">How should ContentFlow represent your brand in its writing?</p>
            </div>

            <div className="grid gap-4">
                {voices.map((v) => (
                    <motion.div
                        key={v.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setData({ ...data, voice: v.id })}
                        className={`
              cursor-pointer p-4 rounded-2xl border transition-all flex items-center gap-4
              ${data.voice === v.id ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10' : 'border-white/10 glass hover:border-white/20'}
            `}
                    >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${data.voice === v.id ? 'bg-primary text-white' : 'bg-white/5 text-slate'}`}>
                            {v.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg">{v.name}</h4>
                            <p className="text-sm text-slate">{v.desc}</p>
                        </div>
                        {data.voice === v.id && <div className="h-2 w-2 rounded-full bg-primary animate-ping" />}
                    </motion.div>
                ))}
            </div>

            <div className="flex gap-4 pt-4">
                <button onClick={prev} className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="flex-1 h-12 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Establish Voice
                </button>
            </div>
        </div>
    );
}

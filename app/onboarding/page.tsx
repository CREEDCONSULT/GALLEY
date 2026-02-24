"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1Business from "@/components/onboarding/Step1Business";
import Step2Voice from "@/components/onboarding/Step2Voice";
import Step3Integrations from "@/components/onboarding/Step3Integrations";
import { createClient } from "@/utils/supabase/client";
import { saveOnboardingData } from "./action";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [data, setData] = useState({
        website: "",
        name: "",
        voice: "authoritative",
        industry: "",
        target_audience: "",
    });

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkUser();
    }, []);

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const handleComplete = async () => {
        if (!user) {
            // Redirect to login if not authenticated at the end
            // We can pass the current state in searchParams or session storage
            localStorage.setItem('onboarding_data', JSON.stringify(data));
            router.push('/login?next=/onboarding&message=Sign in to save your results!');
            return;
        }

        setIsSaving(true);
        const result = await saveOnboardingData(data);
        setIsSaving(false);

        if (result.success) {
            router.push('/dashboard');
        } else {
            alert('Failed to save progress: ' + result.error);
        }
    };

    // If we're coming back from login, resume data
    useEffect(() => {
        const saved = localStorage.getItem('onboarding_data');
        if (saved && user) {
            setData(JSON.parse(saved));
            localStorage.removeItem('onboarding_data');
            setStep(3); // Resume at step 3
        }
    }, [user]);

    return (
        <div className="w-full max-w-2xl px-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-dark p-8 rounded-3xl border border-primary/20 shadow-2xl"
                >
                    {step === 1 && <Step1Business data={data} setData={setData} next={nextStep} />}
                    {step === 2 && <Step2Voice data={data} setData={setData} next={nextStep} prev={prevStep} />}
                    {step === 3 && (
                        <Step3Integrations
                            data={data}
                            prev={prevStep}
                            onComplete={handleComplete}
                            isSaving={isSaving}
                            isAuthenticated={!!user}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveOnboardingData(data: {
    website: string
    name?: string
    voice: string
    industry?: string
    target_audience?: string
    competitor_urls?: string[]
}) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // Update profile
    const { error } = await supabase
        .from('profiles')
        .update({
            website_url: data.website,
            full_name: data.name,
            brand_voice_selection: data.voice,
            industry: data.industry,
            target_audience: data.target_audience,
            competitor_urls: data.competitor_urls || [],
            onboarding_completed: true,
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error saving onboarding data:', error.message)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

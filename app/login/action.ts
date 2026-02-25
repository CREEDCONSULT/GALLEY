'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // SIDE WORKAROUND: Demo Bypass
    if (email === 'tester@example.com' && (!url || !key)) {
        const cookieStore = await cookies()
        cookieStore.set('demo_mode', 'true', { path: '/', maxAge: 60 * 60 * 24 })
        return redirect('/dashboard')
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    })

    if (error) {
        console.error('Login error:', error.message)
        return redirect('/login?error=' + encodeURIComponent(error.message))
    }

    return redirect('/login?message=Check your email for the magic link!')
}

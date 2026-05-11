import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // The `next` parameter is where the user originally tried to go before logging in
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful login.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error, send them back to Anna's signup page with an error flag
  return NextResponse.redirect(`${origin}/signup?error=auth-failed`)
}
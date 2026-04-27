'use client'

import { createClient } from '@/utils/supabase/client'

export default function GoogleSignInButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, 
      },
    })

    if (error) {
      console.error("Error logging in:", error.message)
    }
  }

  return (
    <button 
      onClick={handleLogin}
      //ADD TAILWIND STUFF HERE
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  )
}
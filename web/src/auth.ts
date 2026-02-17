import { createClient } from '@supabase/supabase-js'

import { createAuth } from '@redwoodjs/auth-supabase-web'

// During prerendering, environment variables may not be available.
// Use placeholder values to allow 404.html generation, but ensure
// real credentials are required at runtime.
const isPrerendering = typeof window === 'undefined' && !process.env.SUPABASE_URL

const supabaseUrl = process.env.SUPABASE_URL || 
  (isPrerendering ? 'https://placeholder.supabase.co' : '')
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 
  (isPrerendering ? 'placeholder-key' : '')

if (!isPrerendering && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required'
  )
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export const { AuthProvider, useAuth } = createAuth(supabaseClient)

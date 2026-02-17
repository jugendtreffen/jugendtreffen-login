import { createClient } from '@supabase/supabase-js'

import { createAuth } from '@redwoodjs/auth-supabase-web'

// During prerendering (SSR for static pages), environment variables may not be available.
// RedwoodJS sets __REDWOOD__PRERENDERING during the prerender phase.
// Use placeholder values only during prerendering to allow 404.html generation.
const isPrerendering = 
  typeof globalThis !== 'undefined' && 
  globalThis.__REDWOOD__PRERENDERING === true

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// In production/runtime, fail fast if credentials are missing
if (!isPrerendering && (!supabaseUrl?.trim() || !supabaseAnonKey?.trim())) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required'
  )
}

// Use placeholders during prerendering, real credentials at runtime
export const supabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export const { AuthProvider, useAuth } = createAuth(supabaseClient)

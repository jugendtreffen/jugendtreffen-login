import { createClient } from '@supabase/supabase-js'

import { createAuth } from '@redwoodjs/auth-supabase-web'

// Use dummy values during prerendering when env vars aren't available
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key'

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export const { AuthProvider, useAuth } = createAuth(supabaseClient)

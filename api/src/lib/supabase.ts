import { createClient } from '@supabase/supabase-js'
import { RedwoodError } from '@redwoodjs/api'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl) {
  throw new RedwoodError('SUPABASE_URL ist nicht gesetzt')
}

if (!supabaseServiceKey) {
  throw new RedwoodError('SUPABASE_SECRET_KEY ist nicht gesetzt')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})

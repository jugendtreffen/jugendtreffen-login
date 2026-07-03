import { RedwoodError } from '@redwoodjs/api'
import { supabase } from 'src/lib/supabase'
import { requireAuth } from 'src/lib/auth'

export const staffUsers = async () => {
  requireAuth()

  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    throw new RedwoodError('Fehler beim Laden der Benutzer: ' + error.message)
  }

  return data.users.map((user) => ({
    id: user.id,
    email: user.email ?? '',
    role: (user.app_metadata?.user_role as string) ?? null,
  }))
}

export const updateStaffRole = async ({
                                        input,
                                      }: {
  input: { userId: string; role: string | null }
}) => {
  requireAuth()

  const { data, error } = await supabase.auth.admin.updateUserById(
    input.userId,
    {
      app_metadata: { user_role: input.role ?? null },
    }
  )

  if (error) {
    throw new RedwoodError('Fehler beim Aktualisieren der Rolle: ' + error.message)
  }

  const user = data.user
  return {
    id: user.id,
    email: user.email ?? '',
    role: (user.app_metadata?.user_role as string) ?? null,
  }
}

export const CheckUserExists = async (email: string) => {
  const { data, error } = await supabase.auth.admin.listUsers({
    filter: { email: email },
  })

  if (error) {
    console.error('Error fetching user:', error.message)
    throw new RedwoodError('Es ist ein Fehler aufgetreten')
  }

  return data?.users?.length > 0
}

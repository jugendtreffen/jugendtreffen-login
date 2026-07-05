import {RedwoodError} from '@redwoodjs/api'
import {supabase} from 'src/lib/supabase'
import {requireAuth} from 'src/lib/auth'
import {db} from "src/lib/db";

export const staffUsers = async () => {
  requireAuth({roles: ['admin']})

  const { data, error } = await supabase.auth.admin.listUsers()
  const roles = await db.userRole.findMany()
  if (error) {
    throw new RedwoodError('Fehler beim Laden der Benutzer: ' + error.message)
  }

  return data.users.filter((user) => user.id !== context.currentUser.id).map((user) => ({
    id: user.id,
    email: user.email ?? '',
    role: roles.find((role) => role.userId === user.id)?.role ?? null,
  }))
}

export const updateStaffRole = async ({
                                        input,
                                      }: {
  input: { userId: string; role: string | null }
}) => {
  requireAuth({roles: ['admin']})
  try {
    const userRole = await db.userRole.update({
        where: { userId: input.userId },
        data: {
          role: input.role ?? 'none',
        }
      }
    )
    const {data, error} = await supabase.auth.admin.getUserById(input.userId)
    if (error) {
      throw error
    }

    return {
      id: userRole.userId,
      email: data.user.email,
      role: userRole.role,
    }
  }
  catch (error: any) {
    throw new RedwoodError('Fehler beim Aktualisieren der Rolle: ' + error.message)
  }
}

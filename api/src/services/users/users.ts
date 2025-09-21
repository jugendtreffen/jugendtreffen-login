import { RedwoodError } from '@redwoodjs/api'

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

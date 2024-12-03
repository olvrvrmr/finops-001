import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function getUserRole() {
  const { userId } = await auth()
  if (!userId) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('clerk_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user role:', error)
    return null
  }

  return data?.role
}

export async function requireAuth(allowedRoles: string[]) {
  const role = await getUserRole()
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Unauthorized')
  }
}

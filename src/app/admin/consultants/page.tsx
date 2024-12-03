import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ConsultantList } from './ConsultantList'

export default async function ConsultantsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const { data: consultants, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'CONSULTANT')

  if (error) {
    console.error('Error fetching consultants:', error)
    return <div>Error loading consultants</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Consultants</h1>
      <ConsultantList consultants={consultants} />
    </div>
  )
}


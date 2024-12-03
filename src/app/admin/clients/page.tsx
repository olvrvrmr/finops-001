import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ClientList } from './ClientList'

export default async function ClientsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')

  if (error) {
    console.error('Error fetching clients:', error)
    return <div>Error loading clients</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Clients</h1>
      <ClientList clients={clients} />
    </div>
  )
}


import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AddConsultantForm } from './AddConsultantForm'
import { AddClientForm } from './AddClientForm'
import { checkAdminRole } from '@/lib/auth'

export default async function AdminDashboard() {
  const { userId, orgId } = await auth()
  const user = await currentUser()

  if (!userId || !user || !orgId) {
    redirect('/sign-in')
  }

  const isAdmin = await checkAdminRole(userId, orgId)

  if (!isAdmin) {
    redirect('/unauthorized')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">MSP Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Consultants</h2>
          <AddConsultantForm />
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Clients</h2>
          <AddClientForm />
        </div>
      </div>
    </div>
  )
}


import { auth, clerkClient } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'

export default async function OrganizationPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    return <div className="text-red-500">Not authenticated</div>
  }

  const clerk = await clerkClient()
  const org = await clerk.organizations.getOrganization({ organizationId: params.id })

  if (!org) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
      <h1 className="text-4xl font-bold mb-8">{org.name}</h1>
      <p>Organization ID: {org.id}</p>
      {/* Add more organization details and functionality here */}
    </div>
  )
}


import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { Suspense } from 'react'
import Link from 'next/link'

interface ClerkUser {
  id: string
  firstName: string | null
  lastName: string | null
  emailAddresses: {
    id: string
    emailAddress: string
  }[]
  primaryEmailAddressId: string | null
}

interface OrganizationMembership {
  role: string
  organization: {
    id: string
    name: string
  }
}

async function UserInfo() {
  const { userId } = await auth()
  if (!userId) {
    return <div className="text-red-500">Not authenticated</div>
  }

  const clerk = await clerkClient()
  const user = await clerk.users.getUser(userId) as ClerkUser
  const { data: orgs } = await clerk.users.getOrganizationMembershipList({ userId })

  const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">User Information</h2>
      <p className="mb-2"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      <p className="mb-2"><strong>Email:</strong> {primaryEmail || 'No primary email set'}</p>
      <p className="mb-2"><strong>User ID:</strong> {userId}</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Organizations</h3>
      {orgs.length > 0 ? (
        <ul className="list-disc list-inside">
          {orgs.map((membership: OrganizationMembership) => (
            <li key={membership.organization.id} className="mb-1">
              <Link href={`/org/${membership.organization.id}`} className="text-blue-600 hover:underline">
                {membership.organization.name}
              </Link>
              {' '}({membership.role})
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not a member of any organization.</p>
      )}
      
      <div className="mt-6">
        <Link href="/create-org" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create New Organization
        </Link>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <Suspense fallback={<div>Loading user information...</div>}>
        <UserInfo />
      </Suspense>
    </div>
  )
}




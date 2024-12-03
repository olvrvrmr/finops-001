import { auth, clerkClient } from '@clerk/nextjs/server'

export async function getUserRole() {
  const { userId, orgId } = await auth()
  if (!userId || !orgId) return null

  const clerk = await clerkClient()
  const membershipList = await clerk.organizations.getOrganizationMembershipList({ organizationId: orgId })
  const userMembership = membershipList.data.find(membership => membership.publicUserData?.userId === userId)
  return userMembership?.role
}

export async function checkAdminRole(userId: string, orgId: string) {
  const clerk = await clerkClient()
  const membershipList = await clerk.organizations.getOrganizationMembershipList({ organizationId: orgId })
  const userMembership = membershipList.data.find(membership => membership.publicUserData?.userId === userId)
  return userMembership?.role === 'admin'
}

export async function requireAuth(allowedRoles: string[]) {
  const role = await getUserRole()
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Unauthorized')
  }
}


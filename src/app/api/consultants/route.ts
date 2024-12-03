import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ApiError, handleApiError } from '@/lib/api-error'
import { prisma } from '@/lib/prisma'
import { Consultant } from '@/types'
import { rateLimit } from '@/lib/rate-limit'

async function checkAdminRole(userId: string, orgId: string) {
  const clerk = await clerkClient()
  const membershipList = await clerk.organizations.getOrganizationMembershipList({ organizationId: orgId })
  const userMembership = membershipList.data.find(membership => membership.publicUserData?.userId === userId)
  return userMembership?.role === 'admin'
}

export async function POST(request: Request) {
  try {
    const { userId, orgId } = await auth()

    if (!userId || !orgId) {
      throw new ApiError(401, 'Unauthorized')
    }

    const { success } = await rateLimit.limit(userId)
    if (!success) {
      throw new ApiError(429, 'Too Many Requests')
    }

    const isAdmin = await checkAdminRole(userId, orgId)

    if (!isAdmin) {
      throw new ApiError(403, 'Forbidden')
    }

    const { name, email } = await request.json()

    const newConsultant: Consultant = await prisma.user.create({
      data: {
        name,
        email,
        role: 'CONSULTANT',
        msp: { connect: { id: orgId } }
      }
    })

    return NextResponse.json(newConsultant)
  } catch (error) {
    return handleApiError(error)
  }
}


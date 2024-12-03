import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the current user is an admin
    const { data: adminCheck } = await supabase
      .from('profiles')
      .select('role')
      .eq('clerk_id', userId)
      .single()

    if (adminCheck?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email } = await request.json()

    // Create a new user in Clerk
    const clerk = await clerkClient()
    const newUser = await clerk.users.createUser({
      emailAddress: [email],
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1] || '',
      password: Math.random().toString(36).slice(-8), // Generate a random password
    })

    return NextResponse.json({ id: newUser.id })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}


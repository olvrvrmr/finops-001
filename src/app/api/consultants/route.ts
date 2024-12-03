import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    await requireAuth(['ADMIN'])
    const { data: consultants, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'CONSULTANT')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch consultants' }, { status: 400 })
    }

    return NextResponse.json(consultants)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['ADMIN'])
    const { name, email } = await request.json()

    // Create user in Clerk
    const clerk = await clerkClient()
    const newUser = await clerk.users.createUser({
      emailAddress: [email],
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1] || '',
      password: Math.random().toString(36).slice(-8), // Generate a random password
    })

    // Add the user to the Supabase profiles table
    const { data: consultant, error } = await supabase
      .from('profiles')
      .insert({
        clerk_id: newUser.id,
        name,
        email,
        role: 'CONSULTANT',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create consultant' }, { status: 400 })
    }

    return NextResponse.json(consultant)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(['ADMIN'])
    const { id, name, email } = await request.json()

    const { data: consultant, error } = await supabase
      .from('profiles')
      .update({ name, email })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update consultant' }, { status: 400 })
    }

    return NextResponse.json(consultant)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(['ADMIN'])
    const { id } = await request.json()

    const { data: consultant, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to delete consultant' }, { status: 400 })
    }

    // Delete user from Clerk
    const clerk = await clerkClient()
    await clerk.users.deleteUser(consultant.clerk_id)

    return NextResponse.json({ message: 'Consultant deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}


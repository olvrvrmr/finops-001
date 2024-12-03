import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  try {
    await requireAuth(['ADMIN', 'CONSULTANT'])
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 400 })
    }

    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(['ADMIN'])
    const { name } = await request.json()

    const { data: client, error } = await supabase
      .from('clients')
      .insert({ name })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create client' }, { status: 400 })
    }

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(['ADMIN'])
    const { id, name } = await request.json()

    const { data: client, error } = await supabase
      .from('clients')
      .update({ name })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update client' }, { status: 400 })
    }

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(['ADMIN'])
    const { id } = await request.json()

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete client' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized or invalid request' }, { status: 400 })
  }
}


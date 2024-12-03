import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'

export default async function Home() {
  const user = await currentUser()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold mb-6">
        Welcome to our Multi-tenant SaaS!
      </h1>
      
      {user ? (
        <Link href="/dashboard" className="text-blue-600 hover:underline text-2xl">
          Go to Dashboard
        </Link>
      ) : (
        <p className="text-2xl">Sign in to access your dashboard</p>
      )}
    </div>
  )
}


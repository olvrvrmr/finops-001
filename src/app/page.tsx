import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Timesheets</h1>
      <SignedOut>
        <p className="text-xl mb-4">Please sign in to manage your timesheets effectively</p>
      </SignedOut>
      <SignedIn>
        <p className="text-xl mb-4">Manage your timesheets effectively</p>
        <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Dashboard
        </Link>
      </SignedIn>
    </div>
  )
}


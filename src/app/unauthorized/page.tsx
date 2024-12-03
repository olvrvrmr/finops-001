import Link from 'next/link'

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
      <p className="text-xl mb-4">You don't have access to this tenant.</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  )
}


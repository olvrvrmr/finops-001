'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'

export default function CreateOrganization() {
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { createOrganization } = useClerk()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!orgName.trim()) {
      setError('Organization name is required')
      return
    }

    try {
      const organization = await createOrganization({ name: orgName })
      if (organization) {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Failed to create organization. Please try again.')
      console.error('Error creating organization:', err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Create New Organization</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="orgName" className="block text-gray-700 text-sm font-bold mb-2">
            Organization Name
          </label>
          <input
            type="text"
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter organization name"
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Organization
          </button>
        </div>
      </form>
    </div>
  )
}


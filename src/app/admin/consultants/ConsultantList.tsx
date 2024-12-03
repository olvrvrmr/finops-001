'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Consultant = {
  id: string
  name: string
  email: string
}

export function ConsultantList({ consultants: initialConsultants }: { consultants: Consultant[] }) {
  const [consultants, setConsultants] = useState(initialConsultants)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this consultant?')) {
      const response = await fetch('/api/consultants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setConsultants(consultants.filter(c => c.id !== id))
      } else {
        alert('Failed to delete consultant')
      }
    }
  }

  return (
    <div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {consultants.map((consultant) => (
            <tr key={consultant.id}>
              <td className="py-2 px-4 border-b">{consultant.name}</td>
              <td className="py-2 px-4 border-b">{consultant.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => router.push(`/admin/consultants/${consultant.id}`)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(consultant.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


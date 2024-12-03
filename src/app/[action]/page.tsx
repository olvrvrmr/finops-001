'use client'

import { useParams } from 'next/navigation'
import Timesheet from '@/components/Timesheet'
import { useEffect, useState } from 'react'

export default function TimesheetPage() {
  const params = useParams()
  const id = params.action === 'new-timesheet' ? undefined : params.action as string
  const [timesheetData, setTimesheetData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id && id !== 'new-timesheet') {
      const storedTimesheet = localStorage.getItem(`timesheet_${id}`)
      if (storedTimesheet) {
        setTimesheetData(JSON.parse(storedTimesheet))
      }
    }
    setLoading(false)
  }, [id])

  const customers = [
    { code: 'SPEAR', description: 'SpearIT' },
    { code: 'ACME', description: 'ACME Corp' },
    { code: 'GLOB', description: 'Global Tech' },
  ]

  const additionalCodes = [
    { code: 'HOL', description: 'Holiday' },
    { code: 'SICK', description: 'Sick Leave' },
    { code: 'VAC', description: 'Vacation' },
  ]

  if (loading) {
    return <div>Loading...</div>
  }

  if (id && id !== 'new-timesheet' && !timesheetData) {
    return <div>Timesheet not found</div>
  }

  return (
    <main className="container mx-auto p-4">
      <Timesheet 
        id={id}
        employee={timesheetData?.employee || "Olivier Vermeir"}
        year={timesheetData?.year || new Date().getFullYear()}
        customers={customers}
        additionalCodes={additionalCodes}
        initialData={timesheetData}
      />
    </main>
  )
}


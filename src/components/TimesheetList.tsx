'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface TimesheetSummary {
  id: string
  employee: string
  month: string
  year: number
  customer: string
  invoiced_days: number
}

export default function TimesheetList() {
  const [timesheets, setTimesheets] = useState<TimesheetSummary[]>([])

  useEffect(() => {
    fetchTimesheets()
  }, [])

  async function fetchTimesheets() {
    const { data, error } = await supabase
      .from('timesheets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching timesheets:', error)
      toast.error('Failed to load timesheets')
    } else {
      setTimesheets(data || [])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Timesheets</span>
          <Button asChild>
            <Link href="/new-timesheet">
              <PlusCircle className="mr-2 h-4 w-4" /> New Timesheet
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timesheets.length === 0 ? (
          <p>No timesheets found. Create a new one to get started!</p>
        ) : (
          <ul className="space-y-2">
            {timesheets.map((timesheet) => (
              <li key={timesheet.id} className="border p-4 rounded-md">
                <Link href={`/timesheet/${timesheet.id}`} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{timesheet.employee}</h3>
                    <p className="text-sm text-gray-500">{timesheet.month} {timesheet.year}</p>
                    <p className="text-sm text-gray-500">Customer: {timesheet.customer || 'Not specified'}</p>
                  </div>
                  <div className="text-right">
                    <p>Invoiced Days: {timesheet.invoiced_days.toFixed(2)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}


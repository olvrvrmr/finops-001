'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface CustomerCode {
  id: string
  code: string
  description: string
  type: 'customer' | 'additional'
}

interface TimesheetProps {
  id?: string
  employee: string
  year: number
  initialData?: any
}

interface DayEntry {
  id?: string
  date: Date
  code: string
  description: string
  regular_hours: number
  extra_hours: number
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Timesheet({ id, employee, year, initialData }: TimesheetProps) {
  const [entries, setEntries] = useState<DayEntry[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString())
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [customerCodes, setCustomerCodes] = useState<CustomerCode[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchCustomerCodes()
    if (id) {
      fetchTimesheet(id)
    } else {
      generateEntries()
    }
  }, [id, year])

  async function fetchCustomerCodes() {
    const { data, error } = await supabase
      .from('customer_codes')
      .select('*')
      .order('code', { ascending: true })

    if (error) {
      console.error('Error fetching customer codes:', error)
      toast.error('Failed to load customer codes')
    } else {
      setCustomerCodes(data || [])
    }
  }

  async function fetchTimesheet(timesheetId: string) {
    const { data: timesheetData, error: timesheetError } = await supabase
      .from('timesheets')
      .select('*')
      .eq('id', timesheetId)
      .single()

    if (timesheetError) {
      console.error('Error fetching timesheet:', timesheetError)
      toast.error('Failed to load timesheet')
      return
    }

    const { data: entriesData, error: entriesError } = await supabase
      .from('timesheet_entries')
      .select('*')
      .eq('timesheet_id', timesheetId)
      .order('date', { ascending: true })

    if (entriesError) {
      console.error('Error fetching timesheet entries:', entriesError)
      toast.error('Failed to load timesheet entries')
      return
    }

    setSelectedMonth(months.indexOf(timesheetData.month).toString())
    setSelectedCustomer(timesheetData.customer || null)
    setEntries(entriesData.map((entry: DayEntry) => ({ ...entry, date: new Date(entry.date) })))
  }

  const generateEntries = () => {
    const monthIndex = parseInt(selectedMonth)
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    const defaultCustomer = customerCodes.find(c => c.type === 'customer')
    const newEntries = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, monthIndex, i + 1)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      if (!isWeekend) {
        return {
          date,
          code: selectedCustomer || defaultCustomer?.code || '',
          description: customerCodes.find(c => c.code === (selectedCustomer || defaultCustomer?.code))?.description || '',
          regular_hours: 8,
          extra_hours: 0
        }
      }
      return null
    }).filter((entry): entry is DayEntry => entry !== null)
    setEntries(newEntries)
  }

  const updateEntry = (index: number, field: keyof DayEntry, value: string | number) => {
    const newEntries = [...entries]
    if (field === 'code') {
      const selectedCode = customerCodes.find(c => c.code === value)
      const isAdditionalCode = selectedCode?.type === 'additional'
      newEntries[index] = {
        ...newEntries[index],
        code: selectedCode?.code || '',
        description: selectedCode?.description || '',
        regular_hours: isAdditionalCode ? 0 : newEntries[index].regular_hours
      }
    } else {
      newEntries[index] = { ...newEntries[index], [field]: value }
    }
    setEntries(newEntries)
  }

  const updateCustomer = (customerCode: string) => {
    setSelectedCustomer(customerCode)
    const selectedCustomerData = customerCodes.find(c => c.code === customerCode)
    if (selectedCustomerData) {
      setEntries(entries.map(entry => ({
        ...entry,
        code: customerCode,
        description: selectedCustomerData.description
      })))
    }
  }

  const totalRegularHours = entries.reduce((sum, entry) => sum + entry.regular_hours, 0)
  const totalExtraHours = entries.reduce((sum, entry) => sum + entry.extra_hours, 0)
  const totalDays = totalRegularHours / 8
  const totalInvoicedDays = totalDays

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return `${days[date.getDay()]} ${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]}`
  }

  const saveTimesheet = async () => {
    const timesheetData = {
      id: id || undefined,
      employee,
      month: months[parseInt(selectedMonth)],
      year,
      customer: selectedCustomer,
      total_regular_hours: totalRegularHours,
      total_extra_hours: totalExtraHours,
      invoiced_days: Number(totalInvoicedDays.toFixed(2))
    }

    let timesheetId: string

    if (id) {
      const { error } = await supabase
        .from('timesheets')
        .update(timesheetData)
        .eq('id', id)

      if (error) {
        console.error('Error updating timesheet:', error)
        toast.error('Failed to update timesheet')
        return
      }
      timesheetId = id
    } else {
      const { data, error } = await supabase
        .from('timesheets')
        .insert(timesheetData)
        .select()

      if (error) {
        console.error('Error creating timesheet:', error)
        toast.error('Failed to create timesheet')
        return
      }
      timesheetId = data[0].id
    }

    // Delete existing entries and insert new ones
    if (id) {
      const { error } = await supabase
        .from('timesheet_entries')
        .delete()
        .eq('timesheet_id', timesheetId)

      if (error) {
        console.error('Error deleting existing timesheet entries:', error)
        toast.error('Failed to update timesheet entries')
        return
      }
    }

    const entriesToInsert = entries.map(entry => ({
      timesheet_id: timesheetId,
      date: entry.date.toISOString().split('T')[0],
      code: entry.code,
      description: entry.description,
      regular_hours: entry.regular_hours,
      extra_hours: entry.extra_hours
    }))

    const { error: insertError } = await supabase
      .from('timesheet_entries')
      .insert(entriesToInsert)

    if (insertError) {
      console.error('Error inserting timesheet entries:', insertError)
      toast.error('Failed to save timesheet entries')
      return
    }

    toast.success('Timesheet saved successfully')
    router.push('/')
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Image
              src="/placeholder.svg?height=50&width=150"
              alt="Company Logo"
              width={150}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => router.push('/')} aria-label="Close timesheet">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Monthly Timesheet</h1>
          <span className="text-xl">{employee}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Period:</span>
          <Select value={selectedMonth} onValueChange={(value) => {
            setSelectedMonth(value);
            generateEntries();
          }} disabled={!!id}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>{months[parseInt(selectedMonth)]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Customer:</span>
          <Select value={selectedCustomer || ''} onValueChange={updateCustomer} disabled={!!id}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customerCodes.filter(c => c.type === 'customer').map((customer) => (
                <SelectItem key={customer.code} value={customer.code}>
                  {customer.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Date</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Regular Hours</TableHead>
              <TableHead className="text-right">Extra Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={entry.date.toISOString()} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                <TableCell>{formatDate(entry.date)}</TableCell>
                <TableCell>
                  <Select value={entry.code} onValueChange={(value) => updateEntry(index, 'code', value)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Select code" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerCodes.map((code) => (
                        <SelectItem key={code.code} value={code.code}>
                          {code.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={entry.regular_hours}
                    onChange={(e) => updateEntry(index, 'regular_hours', parseFloat(e.target.value) || 0)}
                    className="w-16 text-right"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    value={entry.extra_hours}
                    onChange={(e) => updateEntry(index, 'extra_hours', parseFloat(e.target.value) || 0)}
                    className="w-16 text-right"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Regular Hours</span>
            <span>{totalRegularHours}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Extra Hours</span>
            <span>{totalExtraHours}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Days</span>
            <span>{totalDays.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total invoiced days</span>
            <span>{totalInvoicedDays.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={saveTimesheet}>Save Timesheet</Button>
        </div>
      </CardContent>
    </Card>
  )
}


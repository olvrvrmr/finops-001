'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

interface CustomerCode {
  code: string
  description: string
  type: 'customer' | 'additional'
}

export default function CustomerCodeManager() {
  const [customerCodes, setCustomerCodes] = useState<CustomerCode[]>([])
  const [newCode, setNewCode] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState<'customer' | 'additional'>('customer')

  useEffect(() => {
    fetchCustomerCodes()
  }, [])

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

  async function addCustomerCode() {
    if (newCode && newDescription) {
      const { data, error } = await supabase
        .from('customer_codes')
        .insert({ code: newCode, description: newDescription, type: newType })
        .select()

      if (error) {
        console.error('Error adding customer code:', error)
        toast.error('Failed to add customer code')
      } else if (data) {
        setCustomerCodes([...customerCodes, data[0]])
        setNewCode('')
        setNewDescription('')
        toast.success('Customer code added successfully')
      }
    }
  }

  async function deleteCustomerCode(id: string) {
    const { error } = await supabase
      .from('customer_codes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting customer code:', error)
      toast.error('Failed to delete customer code')
    } else {
      setCustomerCodes(customerCodes.filter(code => code.id !== id))
      toast.success('Customer code deleted successfully')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Customers and Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-code">Code</Label>
              <Input
                id="new-code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Enter code"
              />
            </div>
            <div>
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label htmlFor="new-type">Type</Label>
              <Select value={newType} onValueChange={(value: 'customer' | 'additional') => setNewType(value)}>
                <SelectTrigger id="new-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="additional">Additional Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addCustomerCode}>Add Customer/Code</Button>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerCodes.map((customerCode) => (
              <TableRow key={customerCode.id}>
                <TableCell>{customerCode.code}</TableCell>
                <TableCell>{customerCode.description}</TableCell>
                <TableCell>{customerCode.type}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteCustomerCode(customerCode.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, CheckCircle, XCircle, Clock, BarChart2 } from "lucide-react"

interface Order {
  id: string
  customer: string
  restaurant: string
  total: number
  status: string
  date: string
}

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching restaurant orders data
    setTimeout(() => {
      setOrders([
        { id: "ORD-5001", customer: "John Doe", restaurant: "Burger Palace", total: 25.95, status: "delivered", date: "2023-04-15" },
        { id: "ORD-5002", customer: "Jane Smith", restaurant: "Pizza Heaven", total: 32.50, status: "out_for_delivery", date: "2023-04-15" },
        { id: "ORD-5003", customer: "Robert Johnson", restaurant: "Sushi Express", total: 45.80, status: "preparing", date: "2023-04-15" },
        { id: "ORD-5004", customer: "Emily Brown", restaurant: "Taco Time", total: 18.75, status: "pending", date: "2023-04-15" },
        { id: "ORD-5005", customer: "Michael Wilson", restaurant: "Pasta Place", total: 29.99, status: "delivered", date: "2023-04-14" }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500"
      case "preparing": return "bg-blue-500"
      case "out_for_delivery": return "bg-purple-500"
      case "delivered": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <BarChart2 className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2 text-lg">Loading restaurant dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Dashboard</h1>
        <p className="text-muted-foreground">Manage your restaurant's orders and view analytics.</p>
      </div>

      {/* Orders Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    {order.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm"><XCircle className="mr-2 h-4 w-4" />Reject</Button>
                        <Button size="sm"><CheckCircle className="mr-2 h-4 w-4" />Accept & Prepare</Button>
                      </>
                    )}
                    {order.status === "preparing" && (
                      <Button size="sm"><CheckCircle className="mr-2 h-4 w-4" />Mark as Ready</Button>
                    )}
                    {order.status === "ready" && (
                      <Button size="sm"><CheckCircle className="mr-2 h-4 w-4" />Confirm Pickup</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

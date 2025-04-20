"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface OrderItem {
  menu_item_id: string
  quantity: number
  price: number
  _id: string
}

interface Order {
  _id: string
  order_id: string
  user_id: string
  total_amount: number
  status: string
  items: OrderItem[]
  restaurant_id: string
  delivery_fee: number
  delivery_address: string
  phone: string
  email: string
  createdAt: string
  updatedAt: string
}

function getDateString(date: Date) {
  // Returns YYYY-MM-DD
  return date.toISOString().slice(0, 10)
}

function getDateRange(start: Date, end: Date) {
  // Returns array of Date objects from start to end (inclusive)
  const range = []
  let current = new Date(start)
  while (current <= end) {
    range.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return range
}

export default function OrderHistoryPage() {
  const restaurantId = "68035d30a05864216cc9dd25"
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dailyCounts, setDailyCounts] = useState<{labels: string[], data: number[]}>({labels: [], data: []})

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:3008/api/orders?restaurant_id=${restaurantId}`)
        if (!response.ok) throw new Error("Failed to fetch orders")
        const data = await response.json()
        setOrders(data)

        // Parse all order dates
        const dates = data.map((order: Order) => new Date(order.createdAt))
        if (dates.length === 0) {
          setDailyCounts({labels: [], data: []})
          return
        }

        // Find first and last date
        dates.sort((a: { getTime: () => number }, b: { getTime: () => number }) => a.getTime() - b.getTime())
        const startDate = new Date(dates[0].toISOString().slice(0, 10)) // midnight
        const endDate = new Date() // today

        // Build date range
        const dateRange = getDateRange(startDate, endDate)
        const dateLabels = dateRange.map(getDateString)

        // Count orders per day
        const counts: {[date: string]: number} = {}
        dateLabels.forEach(date => { counts[date] = 0 })
        data.forEach((order: Order) => {
          const dateStr = getDateString(new Date(order.createdAt))
          if (counts[dateStr] !== undefined) counts[dateStr] += 1
        })

        setDailyCounts({
          labels: dateLabels,
          data: dateLabels.map(date => counts[date])
        })
      } catch (error) {
        console.error("Error fetching orders:", error)
        setOrders([])
        setDailyCounts({labels: [], data: []})
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [restaurantId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-purple-500"
      case "out_for_delivery":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Chart data for orders per day since first order
  const chartData = {
    labels: dailyCounts.labels,
    datasets: [
      {
        label: "Number of Orders",
        data: dailyCounts.data,
        backgroundColor: "#6366f1",
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Orders Placed Per Day (Since First Order)" },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15, // Adjust for readability
        }
      },
      y: { beginAtZero: true, precision: 0 },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          All orders placed for this restaurant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders Per Day (Since First Order)</CardTitle>
          <CardDescription>
            Number of orders placed each day from your first order to today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyCounts.labels.length === 0 ? (
            <div>No orders to display.</div>
          ) : (
            <div style={{ maxWidth: 900 }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            List of all orders for this restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div>No orders found for this restaurant.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Delivery Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{order.delivery_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

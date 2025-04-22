"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import { Users, Store, ShoppingBag, DollarSign, ArrowUpRight } from "lucide-react"
import { Bar as ChartBar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

// Define types for the data objects
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

interface User {
  id: string
  name: string
  email: string
  role: string
  date: string
}

interface Restaurant {
  id: string
  name: string
  owner: string
  status: string
  date: string
}

interface DashboardData {
  totalUsers: number
  totalRestaurants: number
  totalOrders: number
  totalRevenue: number
  activeDeliveries: number
  recentOrders: Order[]
  recentUsers: User[]
  pendingRestaurants: Restaurant[]
}

const revenueData = [
  { name: "Jan", revenue: 12400 },
  { name: "Feb", revenue: 15600 },
  { name: "Mar", revenue: 14200 },
  { name: "Apr", revenue: 18900 },
  { name: "May", revenue: 21500 },
  { name: "Jun", revenue: 25800 },
  { name: "Jul", revenue: 28300 },
]

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeDeliveries: 0,
    recentOrders: [],
    recentUsers: [],
    pendingRestaurants: [],
  })

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const token = localStorage.getItem("token") // get JWT from storage
        const res = await fetch("http://localhost:4000/api/auth/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send JWT in Authorization header
          },
        })
        if (!res.ok) throw new Error("Failed to fetch users")
        const data = await res.json()
        setDashboardData((prev) => ({
          ...prev,
          totalUsers: Array.isArray(data) ? data.length : 0,
        }))
      } catch (error) {
        console.error("Error fetching total users:", error)
        setDashboardData((prev) => ({
          ...prev,
          totalUsers: 0,
        }))
      }
    }
    fetchTotalUsers()
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch orders and restaurants from endpoints
        const [ordersRes, restaurantsRes] = await Promise.all([
          fetch("http://localhost:3008/api/orders"),
          fetch("http://localhost:3001/api/restaurants"),
        ])
        const ordersRaw = await ordersRes.json()
        const restaurantsData = await restaurantsRes.json()

        // Map/transform orders to fit the updated Order interface
        const ordersData: Order[] = Array.isArray(ordersRaw)
          ? ordersRaw.map((order: any) => ({
              _id: order._id || "",
              order_id: order.order_id || "",
              user_id: order.user_id || "",
              total_amount: typeof order.total_amount === "number" ? order.total_amount : Number(order.total_amount) || 0,
              status: order.status || "",
              items: order.items || [],
              restaurant_id: order.restaurant_id || "",
              delivery_fee: typeof order.delivery_fee === "number" ? order.delivery_fee : Number(order.delivery_fee) || 0,
              delivery_address: order.delivery_address || "",
              phone: order.phone || "",
              email: order.email || "",
              createdAt: order.createdAt || "",
              updatedAt: order.updatedAt || "",
            }))
          : []

        setDashboardData((prev) => ({
          ...prev,
          totalOrders: ordersData.length,
          totalRestaurants: Array.isArray(restaurantsData) ? restaurantsData.length : 0,
          totalRevenue: 328945.75,
          activeDeliveries: 87,
          recentOrders: ordersData,
          recentUsers: prev.recentUsers,
          pendingRestaurants: prev.pendingRestaurants,
        }))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "out_for_delivery":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Platoo admin dashboard. Here's what's happening today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +5% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +18% from last month
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +8% from last month
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Order History Section */}
      <OrderHistoryPage />
    </div>
  )
}

function OrderHistoryPage() {
  const restaurantId = "68035d30a05864216cc9dd25"
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dailyCounts, setDailyCounts] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })

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
          setDailyCounts({ labels: [], data: [] })
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
        const counts: { [date: string]: number } = {}
        dateLabels.forEach((date) => {
          counts[date] = 0
        })
        data.forEach((order: Order) => {
          const dateStr = getDateString(new Date(order.createdAt))
          if (counts[dateStr] !== undefined) counts[dateStr] += 1
        })

        setDailyCounts({
          labels: dateLabels,
          data: dateLabels.map((date) => counts[date]),
        })
      } catch (error) {
        console.error("Error fetching orders:", error)
        setOrders([])
        setDailyCounts({ labels: [], data: [] })
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
        },
      },
      y: { beginAtZero: true, precision: 0 },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">All orders placed for this restaurant.</p>
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
              <ChartBar data={chartData} options={chartOptions} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>List of all orders for this restaurant</CardDescription>
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
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
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
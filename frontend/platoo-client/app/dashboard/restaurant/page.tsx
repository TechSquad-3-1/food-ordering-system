"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Store, ShoppingBag, Truck, DollarSign, ArrowUpRight, AlertCircle, CheckCircle2 } from "lucide-react"

// Define types for the data objects
interface Order {
  id: string;
  customer: string;
  restaurant: string;
  total: number;
  status: string;
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  date: string;
}

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  status: string;
  date: string;
}

interface DashboardData {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  activeDeliveries: number;
  recentOrders: Order[];
  recentUsers: User[];
  pendingRestaurants: Restaurant[];
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

const ordersData = [
  { name: "Mon", orders: 120 },
  { name: "Tue", orders: 145 },
  { name: "Wed", orders: 132 },
  { name: "Thu", orders: 167 },
  { name: "Fri", orders: 189 },
  { name: "Sat", orders: 210 },
  { name: "Sun", orders: 198 },
]

const userTypeData = [
  { name: "Customers", value: 65 },
  { name: "Restaurant Owners", value: 15 },
  { name: "Delivery Personnel", value: 20 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

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
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setDashboardData({
          totalUsers: 3248,
          totalRestaurants: 164,
          totalOrders: 12892,
          totalRevenue: 328945.75,
          activeDeliveries: 87,
          recentOrders: [
            {
              id: "ORD-5001",
              customer: "John Doe",
              restaurant: "Burger Palace",
              total: 25.95,
              status: "delivered",
              date: "2023-04-15",
            },
            {
              id: "ORD-5002",
              customer: "Jane Smith",
              restaurant: "Pizza Heaven",
              total: 32.5,
              status: "out_for_delivery",
              date: "2023-04-15",
            },
            {
              id: "ORD-5003",
              customer: "Robert Johnson",
              restaurant: "Sushi Express",
              total: 45.8,
              status: "preparing",
              date: "2023-04-15",
            },
            {
              id: "ORD-5004",
              customer: "Emily Brown",
              restaurant: "Taco Time",
              total: 18.75,
              status: "pending",
              date: "2023-04-15",
            },
            {
              id: "ORD-5005",
              customer: "Michael Wilson",
              restaurant: "Pasta Place",
              total: 29.99,
              status: "delivered",
              date: "2023-04-14",
            },
          ],
          recentUsers: [
            { id: "USR-1001", name: "Sarah Johnson", email: "sarah.j@example.com", role: "user", date: "2023-04-15" },
            {
              id: "USR-1002",
              name: "Mike Chen",
              email: "mike.c@example.com",
              role: "restaurant_owner",
              date: "2023-04-14",
            },
            {
              id: "USR-1003",
              name: "Lisa Wong",
              email: "lisa.w@example.com",
              role: "delivery_man",
              date: "2023-04-13",
            },
            { id: "USR-1004", name: "David Smith", email: "david.s@example.com", role: "user", date: "2023-04-12" },
            { id: "USR-1005", name: "Emma Davis", email: "emma.d@example.com", role: "user", date: "2023-04-11" },
          ],
          pendingRestaurants: [
            { id: "RES-3001", name: "Burger Palace", owner: "Mike Chen", status: "pending_review", date: "2023-04-15" },
            {
              id: "RES-3002",
              name: "Pizza Heaven",
              owner: "Angela Martinez",
              status: "pending_review",
              date: "2023-04-14",
            },
            {
              id: "RES-3003",
              name: "Sushi Express",
              owner: "Takashi Yamamoto",
              status: "pending_documents",
              date: "2023-04-13",
            },
          ],
        })
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "user":
        return "bg-blue-500"
      case "restaurant_owner":
        return "bg-orange-500"
      case "delivery_man":
        return "bg-green-500"
      case "admin":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Platoo restaurant dashboard. Here's what's happening today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">order history</CardTitle>
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
            <CardTitle className="text-sm font-medium">delivery Orders</CardTitle>
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
            <CardTitle className="text-sm font-medium">pending orders</CardTitle>
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
            <CardTitle>delivery orders</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order history</CardTitle>
            <CardDescription>Daily orders for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#ef4444" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      

        
      
    </div>
  )
}

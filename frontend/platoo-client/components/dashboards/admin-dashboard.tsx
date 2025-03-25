"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, Store, TruckIcon, BarChart3, Search, ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag } from 'lucide-react'

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalDeliveries: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentOrders: [],
    recentRestaurants: []
  })

  useEffect(() => {
    // In a real app, fetch admin dashboard data from API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setStats({
        totalUsers: 1248,
        totalRestaurants: 64,
        totalDeliveries: 892,
        totalRevenue: 28945.75,
        recentUsers: [
          { id: "USR-1001", name: "Sarah Johnson", email: "sarah.j@example.com", role: "user", date: "2023-04-15" },
          { id: "USR-1002", name: "Mike Chen", email: "mike.c@example.com", role: "restaurant_owner", date: "2023-04-14" },
          { id: "USR-1003", name: "Lisa Wong", email: "lisa.w@example.com", role: "delivery_man", date: "2023-04-13" },
          { id: "USR-1004", name: "David Smith", email: "david.s@example.com", role: "user", date: "2023-04-12" },
          { id: "USR-1005", name: "Emma Davis", email: "emma.d@example.com", role: "user", date: "2023-04-11" }
        ],
        recentOrders: [
          { id: "ORD-5001", customer: "John Doe", restaurant: "Burger Palace", total: 25.95, status: "delivered", date: "2023-04-15" },
          { id: "ORD-5002", customer: "Jane Smith", restaurant: "Pizza Heaven", total: 32.50, status: "out_for_delivery", date: "2023-04-15" },
          { id: "ORD-5003", customer: "Robert Johnson", restaurant: "Sushi Express", total: 45.80, status: "preparing", date: "2023-04-15" },
          { id: "ORD-5004", customer: "Emily Brown", restaurant: "Taco Time", total: 18.75, status: "pending", date: "2023-04-15" },
          { id: "ORD-5005", customer: "Michael Wilson", restaurant: "Pasta Place", total: 29.99, status: "delivered", date: "2023-04-14" }
        ],
        recentRestaurants: [
          { id: "RES-3001", name: "Burger Palace", owner: "Mike Chen", orders: 145, rating: 4.7, date: "2023-03-10" },
          { id: "RES-3002", name: "Pizza Heaven", owner: "Angela Martinez", orders: 210, rating: 4.5, date: "2023-03-05" },
          { id: "RES-3003", name: "Sushi Express", owner: "Takashi Yamamoto", orders: 98, rating: 4.8, date: "2023-03-15" },
          { id: "RES-3004", name: "Taco Time", owner: "Carlos Rodriguez", orders: 120, rating: 4.2, date: "2023-02-28" },
          { id: "RES-3005", name: "Pasta Place", owner: "Sophia Romano", orders: 87, rating: 4.6, date: "2023-03-20" }
        ]
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    { title: "Users", href: "/dashboard/users", icon: "users" },
    { title: "Restaurants", href: "/dashboard/restaurants", icon: "store" },
    { title: "Orders", href: "/dashboard/orders", icon: "shopping-bag" },
    { title: "Delivery", href: "/dashboard/delivery", icon: "truck" },
    { title: "Reports", href: "/dashboard/reports", icon: "bar-chart-3" },
    { title: "Settings", href: "/dashboard/settings", icon: "settings" },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "user": return "bg-blue-500"
      case "restaurant_owner": return "bg-orange-500"
      case "delivery_man": return "bg-green-500"
      case "admin": return "bg-purple-500"
      default: return "bg-gray-500"
    }
  }

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
      <DashboardLayout navItems={navItems}>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-lg">Loading admin dashboard...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your entire food ordering platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
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
              <CardTitle className="text-sm font-medium">
                Total Restaurants
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
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
              <CardTitle className="text-sm font-medium">
                Total Deliveries
              </CardTitle>
              <TruckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeliveries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                  -3% from last month
                </span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  +8% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Latest orders across all restaurants
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Restaurant</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.restaurant}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">View All Orders</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    Newly registered users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                        <Badge className={`${getRoleColor(user.role)} text-white`}>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">View All Users</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-8"
                      />
                    </div>
                    <Button>Add User</Button>
                  </div>
                </div>
                <CardDescription>
                  Manage all users across your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={`${getRoleColor(user.role)} text-white`}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="restaurants" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Restaurant Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search restaurants..."
                        className="pl-8"
                      />
                    </div>
                    <Button>Add Restaurant</Button>
                  </div>
                </div>
                <CardDescription>
                  Manage all restaurants on your platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentRestaurants.map((restaurant) => (
                      <TableRow key={restaurant.id}>
                        <TableCell className="font-medium">{restaurant.id}</TableCell>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.owner}</TableCell>
                        <TableCell>{restaurant.orders}</TableCell>
                        <TableCell>{restaurant.rating}/5.0</TableCell>
                        <TableCell>{restaurant.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Management</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8"
                    />
                  </div>
                </div>
                <CardDescription>
                  Track and manage all orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.restaurant}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Update</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

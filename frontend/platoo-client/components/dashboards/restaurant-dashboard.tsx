"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Store, BarChart3, DollarSign, ShoppingBag, Search, PlusCircle, Edit, Trash2, Clock, CheckCircle, XCircle, User, Phone, MapPin } from 'lucide-react'

interface RestaurantDashboardProps {
  userId: string
}

interface RestaurantProfile {
  name: string
  address: string
  phone: string
  email: string
  ownerName: string
  rating: number
  totalOrders: number
  totalRevenue: number
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  image?: string
}

interface Order {
  id: string
  customer: {
    name: string
    address: string
    phone: string
  }
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  date: string
}

export default function RestaurantDashboard({ userId }: RestaurantDashboardProps) {
  const [profile, setProfile] = useState<RestaurantProfile | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch restaurant profile, menu and orders from API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setProfile({
        name: "Burger Palace",
        address: "234 West St, City, Country",
        phone: "+1 (555) 123-4567",
        email: "info@burgerpalace.com",
        ownerName: "Mike Chen",
        rating: 4.7,
        totalOrders: 1245,
        totalRevenue: 28945.75
      })
      
      setMenu([
        {
          id: "ITEM-1001",
          name: "Classic Cheeseburger",
          description: "Beef patty with cheese, lettuce, tomato, and special sauce",
          price: 8.99,
          category: "Burgers",
          isAvailable: true
        },
        {
          id: "ITEM-1002",
          name: "Double Bacon Burger",
          description: "Two beef patties with bacon, cheese, and BBQ sauce",
          price: 12.99,
          category: "Burgers",
          isAvailable: true
        },
        {
          id: "ITEM-1003",
          name: "Veggie Burger",
          description: "Plant-based patty with avocado, lettuce, and vegan mayo",
          price: 9.99,
          category: "Burgers",
          isAvailable: true
        },
        {
          id: "ITEM-1004",
          name: "French Fries",
          description: "Crispy golden fries with sea salt",
          price: 3.99,
          category: "Sides",
          isAvailable: true
        },
        {
          id: "ITEM-1005",
          name: "Onion Rings",
          description: "Crispy battered onion rings",
          price: 4.99,
          category: "Sides",
          isAvailable: false
        },
        {
          id: "ITEM-1006",
          name: "Chocolate Milkshake",
          description: "Creamy chocolate milkshake with whipped cream",
          price: 5.99,
          category: "Drinks",
          isAvailable: true
        },
        {
          id: "ITEM-1007",
          name: "Soda",
          description: "Choice of Coke, Sprite, or Fanta",
          price: 1.99,
          category: "Drinks",
          isAvailable: true
        }
      ])
      
      setOrders([
        {
          id: "ORD-5001",
          customer: {
            name: "John Doe",
            address: "123 Main St, City, Country",
            phone: "+1 (555) 123-4567"
          },
          items: [
            { name: "Classic Cheeseburger", quantity: 2, price: 8.99 },
            { name: "French Fries", quantity: 1, price: 3.99 },
            { name: "Soda", quantity: 2, price: 1.99 }
          ],
          total: 25.95,
          status: "preparing",
          date: "2023-04-16T14:30:00Z"
        },
        {
          id: "ORD-5002",
          customer: {
            name: "Jane Smith",
            address: "456 Oak St, City, Country",
            phone: "+1 (555) 234-5678"
          },
          items: [
            { name: "Double Bacon Burger", quantity: 1, price: 12.99 },
            { name: "Onion Rings", quantity: 1, price: 4.99 },
            { name: "Chocolate Milkshake", quantity: 1, price: 5.99 }
          ],
          total: 23.97,
          status: "pending",
          date: "2023-04-16T14:45:00Z"
        },
        {
          id: "ORD-5003",
          customer: {
            name: "Robert Johnson",
            address: "789 Pine St, City, Country",
            phone: "+1 (555) 345-6789"
          },
          items: [
            { name: "Veggie Burger", quantity: 1, price: 9.99 },
            { name: "French Fries", quantity: 1, price: 3.99 },
            { name: "Soda", quantity: 1, price: 1.99 }
          ],
          total: 15.97,
          status: "ready",
          date: "2023-04-16T14:15:00Z"
        },
        {
          id: "ORD-4998",
          customer: {
            name: "Emily Brown",
            address: "123 Elm St, City, Country",
            phone: "+1 (555) 456-7890"
          },
          items: [
            { name: "Classic Cheeseburger", quantity: 1, price: 8.99 },
            { name: "Double Bacon Burger", quantity: 1, price: 12.99 },
            { name: "French Fries", quantity: 2, price: 3.99 },
            { name: "Soda", quantity: 2, price: 1.99 }
          ],
          total: 33.94,
          status: "out_for_delivery",
          date: "2023-04-16T13:30:00Z"
        },
        {
          id: "ORD-4995",
          customer: {
            name: "Michael Wilson",
            address: "456 Maple St, City, Country",
            phone: "+1 (555) 567-8901"
          },
          items: [
            { name: "Veggie Burger", quantity: 2, price: 9.99 },
            { name: "Onion Rings", quantity: 1, price: 4.99 },
            { name: "Chocolate Milkshake", quantity: 2, price: 5.99 }
          ],
          total: 36.95,
          status: "delivered",
          date: "2023-04-16T12:45:00Z"
        }
      ])
      
      setIsLoading(false)
    }, 1000)
  }, [userId])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-500"
      case "preparing": return "bg-blue-500"
      case "ready": return "bg-purple-500"
      case "out_for_delivery": return "bg-indigo-500"
      case "delivered": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "Pending"
      case "preparing": return "Preparing"
      case "ready": return "Ready for Pickup"
      case "out_for_delivery": return "Out for Delivery"
      case "delivered": return "Delivered"
      case "cancelled": return "Cancelled"
      default: return "Unknown"
    }
  }

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "layout-dashboard" },
    { title: "Orders", href: "/dashboard/orders", icon: "shopping-bag" },
    { title: "Menu", href: "/dashboard/menu", icon: "utensils" },
    { title: "Customers", href: "/dashboard/customers", icon: "users" },
    { title: "Analytics", href: "/dashboard/analytics", icon: "bar-chart-2" },
    { title: "Settings", href: "/dashboard/settings", icon: "settings" },
  ]

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-lg">Loading restaurant dashboard...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{profile?.name}</h1>
          <p className="text-muted-foreground">
            Manage your restaurant, orders, and menu.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter(order => 
                  new Date(order.date).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 flex items-center">
                  +{Math.floor(Math.random() * 10)}% from yesterday
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
              <div className="text-2xl font-bold">${profile?.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime revenue
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Menu Items
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menu.length}</div>
              <p className="text-xs text-muted-foreground">
                {menu.filter(item => item.isAvailable).length} currently available
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rating
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.rating}/5.0</div>
              <p className="text-xs text-muted-foreground">
                Based on customer reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Active Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
            <TabsTrigger value="profile">Restaurant Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Orders</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
                <CardDescription>
                  Manage incoming and in-progress orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.filter(order => 
                    ["pending", "preparing", "ready"].includes(order.status)
                  ).map((order) => (
                    <div key={order.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold">Order #{order.id}</div>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{order.customer.name}</div>
                          <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        {order.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm">
                              <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="mr-2 h-4 w-4" /> Accept & Prepare
                            </Button>
                          </>
                        )}
                        
                        {order.status === "preparing" && (
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" /> Mark as Ready
                          </Button>
                        )}
                        
                        {order.status === "ready" && (
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" /> Confirm Pickup
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {orders.filter(order => 
                    ["pending", "preparing", "ready"].includes(order.status)
                  ).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Clock className="mb-4 h-16 w-16 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">
                        No active orders at the moment. New orders will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Menu Management</CardTitle>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
                <CardDescription>
                  Manage your restaurant's menu items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menu.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={item.isAvailable ? "default" : "outline"} className={item.isAvailable ? "bg-green-500 text-white" : ""}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                            <Button variant="outline" size="sm">
                              {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order History</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
                <CardDescription>
                  View past completed and cancelled orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.filter(order => 
                      ["delivered", "cancelled", "out_for_delivery"].includes(order.status)
                    ).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {getStatusText(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Profile</CardTitle>
                <CardDescription>
                  Manage your restaurant information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Store className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">Restaurant Name</div>
                        </div>
                        <div>{profile?.name}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">Owner Name</div>
                        </div>
                        <div>{profile?.ownerName}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">Address</div>
                        </div>
                        <div>{profile?.address}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium">Phone</div>
                        </div>
                        <div>{profile?.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button>Edit Restaurant Profile</Button>
                    <Button variant="outline">Update Business Hours</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Restaurant Performance</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-md border p-4">
                        <div className="text-sm text-muted-foreground">Total Orders</div>
                        <div className="text-2xl font-bold">{profile?.totalOrders}</div>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="text-sm text-muted-foreground">Rating</div>
                        <div className="text-2xl font-bold">{profile?.rating}/5.0</div>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                        <div className="text-2xl font-bold">${profile?.totalRevenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

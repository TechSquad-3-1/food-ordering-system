"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Loader2, MapPin, Phone, DollarSign, Clock, CheckCircle, TruckIcon, BarChart3, User, Calendar, MapIcon, Store } from 'lucide-react'

interface DeliveryDashboardProps {
  userId: string
}

interface DeliveryProfile {
  name: string
  email: string
  phone: string
  vehicleNumber: string
  rating: number
  totalDeliveries: number
  totalEarnings: number
}

interface Delivery {
  id: string
  orderId: string
  customer: {
    name: string
    address: string
    phone: string
  }
  restaurant: {
    name: string
    address: string
  }
  status: "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled"
  items: { name: string; quantity: number }[]
  total: number
  estimatedDeliveryTime: string
  distance: string
  earnings: number
  date: string
}

export default function DeliveryDashboard({ userId }: DeliveryDashboardProps) {
  const [profile, setProfile] = useState<DeliveryProfile | null>(null)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null)

  useEffect(() => {
    // In a real app, fetch delivery person profile and deliveries from API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setProfile({
        name: "Alex Rodriguez",
        email: "alex.r@example.com",
        phone: "+1 (555) 987-6543",
        vehicleNumber: "XYZ-789",
        rating: 4.8,
        totalDeliveries: 156,
        totalEarnings: 1875.50
      })
      
      const mockDeliveries = [
        {
          id: "DEL-1001",
          orderId: "ORD-5002",
          customer: {
            name: "Jane Smith",
            address: "456 Oak St, Apt 7B, City, Country",
            phone: "+1 (555) 234-5678"
          },
          restaurant: {
            name: "Pizza Heaven",
            address: "789 Main St, City, Country"
          },
          status: "in_transit" as const,
          items: [
            { name: "Pepperoni Pizza (Large)", quantity: 1 },
            { name: "Garlic Bread", quantity: 1 },
            { name: "Soda", quantity: 2 }
          ],
          total: 32.50,
          estimatedDeliveryTime: "15 minutes",
          distance: "2.3 miles",
          earnings: 6.50,
          date: "2023-04-16T18:45:00Z"
        },
        {
          id: "DEL-1002",
          orderId: "ORD-5003",
          customer: {
            name: "Robert Johnson",
            address: "123 Pine St, City, Country",
            phone: "+1 (555) 345-6789"
          },
          restaurant: {
            name: "Sushi Express",
            address: "567 Center St, City, Country"
          },
          status: "assigned" as const,
          items: [
            { name: "California Roll", quantity: 2 },
            { name: "Miso Soup", quantity: 1 },
            { name: "Green Tea", quantity: 1 }
          ],
          total: 45.80,
          estimatedDeliveryTime: "30 minutes",
          distance: "3.5 miles",
          earnings: 7.25,
          date: "2023-04-16T19:15:00Z"
        },
        {
          id: "DEL-1003",
          orderId: "ORD-4998",
          customer: {
            name: "Emily Brown",
            address: "789 Elm St, City, Country",
            phone: "+1 (555) 456-7890"
          },
          restaurant: {
            name: "Burger Palace",
            address: "234 West St, City, Country"
          },
          status: "delivered" as const,
          items: [
            { name: "Cheeseburger", quantity: 2 },
            { name: "French Fries", quantity: 1 },
            { name: "Milkshake", quantity: 2 }
          ],
          total: 28.75,
          estimatedDeliveryTime: "0 minutes",
          distance: "1.8 miles",
          earnings: 5.75,
          date: "2023-04-16T17:30:00Z"
        },
        {
          id: "DEL-1004",
          orderId: "ORD-4995",
          customer: {
            name: "Michael Wilson",
            address: "567 Maple St, City, Country",
            phone: "+1 (555) 567-8901"
          },
          restaurant: {
            name: "Taco Time",
            address: "890 South St, City, Country"
          },
          status: "delivered" as const,
          items: [
            { name: "Taco Combo", quantity: 1 },
            { name: "Nachos", quantity: 1 },
            { name: "Soda", quantity: 1 }
          ],
          total: 18.75,
          estimatedDeliveryTime: "0 minutes",
          distance: "2.1 miles",
          earnings: 5.25,
          date: "2023-04-16T16:15:00Z"
        },
        {
          id: "DEL-1005",
          orderId: "ORD-4990",
          customer: {
            name: "Sarah Johnson",
            address: "345 Cedar St, City, Country",
            phone: "+1 (555) 678-9012"
          },
          restaurant: {
            name: "Pasta Place",
            address: "123 North St, City, Country"
          },
          status: "delivered" as const,
          items: [
            { name: "Spaghetti Bolognese", quantity: 1 },
            { name: "Garlic Bread", quantity: 1 },
            { name: "Tiramisu", quantity: 1 }
          ],
          total: 29.99,
          estimatedDeliveryTime: "0 minutes",
          distance: "2.7 miles",
          earnings: 6.00,
          date: "2023-04-16T15:00:00Z"
        }
      ]
      
      setDeliveries(mockDeliveries)
      setActiveDelivery(mockDeliveries.find(d => d.status === "in_transit") || null)
      setIsLoading(false)
    }, 1000)
  }, [userId])

  const getStatusColor = (status: Delivery["status"]) => {
    switch (status) {
      case "assigned": return "bg-yellow-500"
      case "picked_up": return "bg-blue-500"
      case "in_transit": return "bg-purple-500"
      case "delivered": return "bg-green-500"
      case "cancelled": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusText = (status: Delivery["status"]) => {
    switch (status) {
      case "assigned": return "Assigned"
      case "picked_up": return "Picked Up"
      case "in_transit": return "In Transit"
      case "delivered": return "Delivered"
      case "cancelled": return "Cancelled"
      default: return "Unknown"
    }
  }

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    { title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
    { title: "Earnings", href: "/dashboard/earnings", icon: "dollar-sign" },
    { title: "Profile", href: "/dashboard/delivery", icon: "user" },
    { title: "Settings", href: "/dashboard/settings", icon: "settings" },
  ]

  if (isLoading) {
    return (
      <DashboardLayout navItems={navItems}>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <span className="ml-2 text-lg">Loading your dashboard...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.name}</h1>
          <p className="text-muted-foreground">
            Manage your deliveries and track your earnings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${deliveries.filter(d => new Date(d.date).toDateString() === new Date().toDateString())
                  .reduce((sum, d) => sum + d.earnings, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {deliveries.filter(d => new Date(d.date).toDateString() === new Date().toDateString()).length} deliveries today
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
              <div className="text-2xl font-bold">{profile?.totalDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime deliveries completed
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
              <Progress value={profile?.rating ? (profile.rating / 5) * 100 : 0} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${profile?.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Delivery</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeDelivery ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Current Delivery</CardTitle>
                    <Badge className={`${getStatusColor(activeDelivery.status)} text-white`}>
                      {getStatusText(activeDelivery.status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    Order #{activeDelivery.orderId} • {new Date(activeDelivery.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Restaurant</h3>
                      <div className="flex items-start space-x-2">
                        <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{activeDelivery.restaurant.name}</div>
                          <div className="text-sm text-muted-foreground">{activeDelivery.restaurant.address}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Customer</h3>
                      <div className="flex items-start space-x-2">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{activeDelivery.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{activeDelivery.customer.address}</div>
                          <div className="text-sm text-muted-foreground">{activeDelivery.customer.phone}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Order Details</h3>
                    <div className="rounded-md border p-4">
                      <div className="space-y-2">
                        {activeDelivery.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between border-t pt-2">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${activeDelivery.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center rounded-md border p-3">
                      <Clock className="mb-1 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Estimated Time</span>
                      <span className="font-medium">{activeDelivery.estimatedDeliveryTime}</span>
                    </div>
                    
                    <div className="flex flex-col items-center rounded-md border p-3">
                      <MapPin className="mb-1 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="font-medium">{activeDelivery.distance}</span>
                    </div>
                    
                    <div className="flex flex-col items-center rounded-md border p-3">
                      <DollarSign className="mb-1 h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Earnings</span>
                      <span className="font-medium">${activeDelivery.earnings.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Phone className="mr-2 h-4 w-4" /> Call Customer
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MapIcon className="mr-2 h-4 w-4" /> Navigation
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Deliveries</CardTitle>
                  <CardDescription>
                    You don't have any active deliveries at the moment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <TruckIcon className="mb-4 h-16 w-16 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Check back soon for new delivery assignments or view your upcoming deliveries.
                    </p>
                    <Button className="mt-4">Check Upcoming Deliveries</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>
                  Deliveries assigned to you that need to be picked up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveries.filter(d => d.status === "assigned").map((delivery) => (
                    <div key={delivery.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold">{delivery.restaurant.name}</div>
                          <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                            {getStatusText(delivery.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(delivery.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">{delivery.restaurant.address}</div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">{delivery.customer.name} • {delivery.customer.address}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="text-center text-sm">
                          <span className="block text-muted-foreground">Distance</span>
                          <span className="font-medium">{delivery.distance}</span>
                        </div>
                        <div className="text-center text-sm">
                          <span className="block text-muted-foreground">Est. Time</span>
                          <span className="font-medium">{delivery.estimatedDeliveryTime}</span>
                        </div>
                        <div className="text-center text-sm">
                          <span className="block text-muted-foreground">Earnings</span>
                          <span className="font-medium">${delivery.earnings.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button size="sm">Start Delivery</Button>
                      </div>
                    </div>
                  ))}
                  
                  {deliveries.filter(d => d.status === "assigned").length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Calendar className="mb-4 h-16 w-16 text-muted-foreground" />
                      <p className="text-center text-muted-foreground">
                        You don't have any upcoming deliveries at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>
                  Your past completed deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveries.filter(d => d.status === "delivered").map((delivery) => (
                    <div key={delivery.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="font-semibold">{delivery.restaurant.name}</div>
                          <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                            {getStatusText(delivery.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(delivery.date).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">{delivery.customer.name}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="text-center text-sm">
                          <span className="block text-muted-foreground">Distance</span>
                          <span className="font-medium">{delivery.distance}</span>
                        </div>
                        <div className="text-center text-sm">
                          <span className="block text-muted-foreground">Earnings</span>
                          <span className="font-medium">${delivery.earnings.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Profile</CardTitle>
                <CardDescription>
                  Your personal and vehicle information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={profile?.name} />
                    <AvatarFallback>{profile?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-4 sm:flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="font-medium">{profile?.name}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>{profile?.phone}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="h-4 w-4 text-muted-foreground" />
                        <div>Vehicle: {profile?.vehicleNumber}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button>Edit Profile</Button>
                      <Button variant="outline">Update Vehicle Info</Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-semibold">Performance Stats</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Total Deliveries</div>
                      <div className="text-2xl font-bold">{profile?.totalDeliveries}</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Rating</div>
                      <div className="text-2xl font-bold">{profile?.rating}/5.0</div>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">Total Earnings</div>
                      <div className="text-2xl font-bold">${profile?.totalEarnings.toFixed(2)}</div>
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
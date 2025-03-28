"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { User, Mail, Phone, Calendar, MapPin, ShoppingBag, Truck, Shield, Edit, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { ActivitySettings } from "@/components/admin/activity-settings"

// Types for different user roles
interface BaseUser {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: "customer" | "restaurant_owner" | "delivery_person" | "admin"
  dateJoined: string
  address: string
  lastActive: string
}

interface Customer extends BaseUser {
  role: "customer"
  totalOrders: number
  totalSpent: number
  favoriteRestaurants: string[]
}

interface RestaurantOwner extends BaseUser {
  role: "restaurant_owner"
  restaurants: {
    id: string
    name: string
    location: string
    rating: number
    totalOrders: number
  }[]
}

interface DeliveryPerson extends BaseUser {
  role: "delivery_person"
  deliveries: {
    completed: number
    inProgress: number
    cancelled: number
  }
  rating: number
  activeHours: number
  vehicle: string
  licenseNumber: string
}

interface Admin extends BaseUser {
  role: "admin"
  permissions: string[]
  lastLogin: string
}

type UserType = Customer | RestaurantOwner | DeliveryPerson | Admin

export default function UserDetails() {
  const params = useParams()
  const userId = params.userId as string
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/users/${userId}`)
        // const data = await response.json()

        // Simulated data for demonstration
        setTimeout(() => {
          // This is mock data - in a real app you'd fetch from your API
          const mockUser: UserType = {
            id: userId,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            avatar: "/placeholder.svg?height=100&width=100",
            role: "customer",
            dateJoined: "2023-01-15",
            address: "123 Main St, Anytown, CA 94321",
            lastActive: "2023-04-15T14:30:00Z",
            totalOrders: 27,
            totalSpent: 842.75,
            favoriteRestaurants: ["Burger Palace", "Pizza Heaven", "Sushi Express"],
          }

          setUser(mockUser)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching user:", error)
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (isLoading) {
    return <UserDetailsSkeleton />
  }

  if (!user) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
          <CardDescription>The requested user could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2">
                {user.role === "customer"
                  ? "Customer"
                  : user.role === "restaurant_owner"
                    ? "Restaurant Owner"
                    : user.role === "delivery_person"
                      ? "Delivery Person"
                      : "Admin"}
              </Badge>
              <span>ID: {user.id}</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.address}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Joined: {new Date(user.dateJoined).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Last active: {new Date(user.lastActive).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Role-specific information */}
              {user.role === "customer" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Total Orders: {user.totalOrders}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-4 w-4 mr-2 flex items-center justify-center text-muted-foreground">$</span>
                        <span>Total Spent: ${user.totalSpent.toFixed(2)}</span>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Favorite Restaurants</h4>
                      <ul className="space-y-1">
                        {user.favoriteRestaurants.map((restaurant, index) => (
                          <li key={index} className="text-sm">
                            {restaurant}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {user.role === "restaurant_owner" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Restaurant Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Restaurant</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Orders</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(user as RestaurantOwner).restaurants.map((restaurant) => (
                          <TableRow key={restaurant.id}>
                            <TableCell className="font-medium">{restaurant.name}</TableCell>
                            <TableCell>{restaurant.location}</TableCell>
                            <TableCell>{restaurant.rating.toFixed(1)}</TableCell>
                            <TableCell>{restaurant.totalOrders}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {user.role === "delivery_person" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Delivery Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Vehicle: {(user as DeliveryPerson).vehicle}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-4 w-4 mr-2 flex items-center justify-center text-muted-foreground">★</span>
                        <span>Rating: {(user as DeliveryPerson).rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-4 w-4 mr-2 flex items-center justify-center text-muted-foreground">🕒</span>
                        <span>Active Hours: {(user as DeliveryPerson).activeHours}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Completed</h4>
                        <p className="text-2xl font-bold">{(user as DeliveryPerson).deliveries.completed}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">In Progress</h4>
                        <p className="text-2xl font-bold">{(user as DeliveryPerson).deliveries.inProgress}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Cancelled</h4>
                        <p className="text-2xl font-bold">{(user as DeliveryPerson).deliveries.cancelled}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {user.role === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Admin Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Last Login: {new Date((user as Admin).lastLogin).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {(user as Admin).permissions.map((permission, index) => (
                          <Badge key={index} variant="secondary">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent user activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivitySettings userId={userId} userType={user.role} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>All orders placed by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Order history content would go here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>User Settings</CardTitle>
                  <CardDescription>Manage user account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>User settings content would go here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function UserDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-60 w-full mt-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Phone,
  User,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  CircleDashed,
  Star,
  LocateFixed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

// Types
interface DeliveryOrder {
  id: string
  restaurant: {
    name: string
    address: string
  }
  customer: {
    name: string
    address: string
  }
  status: "assigned" | "picked_up" | "in_transit" | "delivered" | "failed"
  assignedAt: string
  pickedUpAt: string | null
  deliveredAt: string | null
  estimatedDeliveryTime: string
}

interface DeliveryPerson {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: "active" | "inactive" | "on_delivery"
  vehicle: {
    type: "car" | "motorcycle" | "bicycle" | "scooter"
    licensePlate: string
    model: string
  }
  rating: number
  totalDeliveries: number
  successRate: number
  currentLocation?: {
    latitude: number
    longitude: number
    lastUpdated: string
  }
  activeHours: number
  currentOrder: DeliveryOrder | null
  recentOrders: DeliveryOrder[]
}

export default function DeliveryDetails() {
  const params = useParams()
  const deliveryPersonId = params.deliveryPersonId as string
  const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching delivery person data
    const fetchDeliveryPerson = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/delivery/${deliveryPersonId}`)
        // const data = await response.json()

        // Simulated data for demonstration
        setTimeout(() => {
          const mockDeliveryPerson: DeliveryPerson = {
            id: deliveryPersonId,
            name: "Michael Rodriguez",
            email: "michael.r@example.com",
            phone: "+1 (555) 987-6543",
            avatar: "/placeholder.svg?height=100&width=100",
            status: "on_delivery",
            vehicle: {
              type: "motorcycle",
              licensePlate: "MC-1234",
              model: "Honda CB500X",
            },
            rating: 4.8,
            totalDeliveries: 342,
            successRate: 98.5,
            currentLocation: {
              latitude: 37.7749,
              longitude: -122.4194,
              lastUpdated: "2023-04-15T18:15:00Z",
            },
            activeHours: 5.5,
            currentOrder: {
              id: "ord-789",
              restaurant: {
                name: "Burger Palace",
                address: "123 Main St, Anytown, CA 94321",
              },
              customer: {
                name: "Sarah Johnson",
                address: "456 Oak Ave, Anytown, CA 94321",
              },
              status: "in_transit",
              assignedAt: "2023-04-15T17:45:00Z",
              pickedUpAt: "2023-04-15T18:00:00Z",
              deliveredAt: null,
              estimatedDeliveryTime: "2023-04-15T18:30:00Z",
            },
            recentOrders: [
              {
                id: "ord-788",
                restaurant: {
                  name: "Pizza Heaven",
                  address: "789 Pine St, Anytown, CA 94321",
                },
                customer: {
                  name: "John Smith",
                  address: "321 Elm St, Anytown, CA 94321",
                },
                status: "delivered",
                assignedAt: "2023-04-15T16:00:00Z",
                pickedUpAt: "2023-04-15T16:15:00Z",
                deliveredAt: "2023-04-15T16:45:00Z",
                estimatedDeliveryTime: "2023-04-15T16:45:00Z",
              },
              {
                id: "ord-787",
                restaurant: {
                  name: "Sushi Express",
                  address: "555 Cedar St, Anytown, CA 94321",
                },
                customer: {
                  name: "Emily Brown",
                  address: "888 Maple Ave, Anytown, CA 94321",
                },
                status: "delivered",
                assignedAt: "2023-04-15T14:30:00Z",
                pickedUpAt: "2023-04-15T14:45:00Z",
                deliveredAt: "2023-04-15T15:15:00Z",
                estimatedDeliveryTime: "2023-04-15T15:15:00Z",
              },
            ],
          }

          setDeliveryPerson(mockDeliveryPerson)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching delivery person:", error)
        setIsLoading(false)
      }
    }

    if (deliveryPersonId) {
      fetchDeliveryPerson()
    }
  }, [deliveryPersonId])

  const getStatusIcon = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "assigned":
        return <CircleDashed className="h-4 w-4" />
      case "picked_up":
        return <Package className="h-4 w-4" />
      case "in_transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: DeliveryOrder["status"]) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-500"
      case "picked_up":
        return "bg-blue-500"
      case "in_transit":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDeliveryProgress = (order: DeliveryOrder) => {
    switch (order.status) {
      case "assigned":
        return 25
      case "picked_up":
        return 50
      case "in_transit":
        return 75
      case "delivered":
        return 100
      case "failed":
        return 100
      default:
        return 0
    }
  }

  if (isLoading) {
    return <DeliveryDetailsSkeleton />
  }

  if (!deliveryPerson) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Delivery Person Not Found</CardTitle>
          <CardDescription>The requested delivery person could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/admin/delivery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Delivery
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
            <Link href="/admin/delivery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Delivery Person Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            className={
              deliveryPerson.status === "active"
                ? "bg-green-500"
                : deliveryPerson.status === "on_delivery"
                  ? "bg-orange-500"
                  : "bg-gray-500"
            }
          >
            <span className="capitalize">{deliveryPerson.status.replace("_", " ")}</span>
          </Badge>
          <Button>Contact</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={deliveryPerson.avatar} alt={deliveryPerson.name} />
              <AvatarFallback>{deliveryPerson.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{deliveryPerson.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                <span>
                  {deliveryPerson.rating.toFixed(1)} ({deliveryPerson.totalDeliveries} deliveries)
                </span>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{deliveryPerson.phone}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{deliveryPerson.email}</span>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Vehicle Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="capitalize">{deliveryPerson.vehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span>{deliveryPerson.vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License Plate</span>
                  <span>{deliveryPerson.vehicle.licensePlate}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium">{deliveryPerson.successRate}%</span>
                </div>
                <Progress value={deliveryPerson.successRate} className="h-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Hours Today</span>
                  <span>{deliveryPerson.activeHours} hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {deliveryPerson.currentOrder ? (
            <CardHeader>
              <CardTitle className="text-lg">Current Delivery</CardTitle>
              <CardDescription>Order #{deliveryPerson.currentOrder.id}</CardDescription>
            </CardHeader>
          ) : (
            <CardHeader>
              <CardTitle className="text-lg">No Active Delivery</CardTitle>
              <CardDescription>This delivery person is not currently on an active delivery</CardDescription>
            </CardHeader>
          )}

          {deliveryPerson.currentOrder && (
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(deliveryPerson.currentOrder.status)} text-white`}>
                  {getStatusIcon(deliveryPerson.currentOrder.status)}
                  <span className="ml-1 capitalize">{deliveryPerson.currentOrder.status.replace("_", " ")}</span>
                </Badge>
                <div className="text-sm">
                  <span className="text-muted-foreground mr-1">ETA:</span>
                  {new Date(deliveryPerson.currentOrder.estimatedDeliveryTime).toLocaleTimeString()}
                </div>
              </div>

              <div>
                <Progress value={getDeliveryProgress(deliveryPerson.currentOrder)} className="h-2 mb-2" />
                <div className="grid grid-cols-4 text-xs">
                  <div className="text-center">Assigned</div>
                  <div className="text-center">Picked Up</div>
                  <div className="text-center">In Transit</div>
                  <div className="text-center">Delivered</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Restaurant</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="font-medium">{deliveryPerson.currentOrder.restaurant.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {deliveryPerson.currentOrder.restaurant.address}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Customer</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="font-medium">{deliveryPerson.currentOrder.customer.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {deliveryPerson.currentOrder.customer.address}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="mr-2 h-full">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                      <div className="h-full w-px bg-border mx-auto"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Assigned</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(deliveryPerson.currentOrder.assignedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {deliveryPerson.currentOrder.pickedUpAt && (
                    <div className="flex">
                      <div className="mr-2 h-full">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                        <div className="h-full w-px bg-border mx-auto"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Picked Up</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(deliveryPerson.currentOrder.pickedUpAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {deliveryPerson.currentOrder.deliveredAt && (
                    <div className="flex">
                      <div className="mr-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Delivered</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(deliveryPerson.currentOrder.deliveredAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {deliveryPerson.currentLocation && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Current Location</h3>
                    <span className="text-xs text-muted-foreground">
                      Last updated: {new Date(deliveryPerson.currentLocation.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="bg-muted aspect-video rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <LocateFixed className="h-8 w-8 mx-auto text-primary" />
                      <div className="mt-2 text-sm">
                        Lat: {deliveryPerson.currentLocation.latitude.toFixed(4)}, Lng:{" "}
                        {deliveryPerson.currentLocation.longitude.toFixed(4)}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">Map view would be displayed here</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Delivered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryPerson.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>{order.restaurant.name}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                      <span className="capitalize">{order.status.replace("_", " ")}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.assignedAt).toLocaleTimeString()}</TableCell>
                  <TableCell>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleTimeString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              View All Deliveries
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DeliveryDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px] md:col-span-2" />
      </div>

      <Skeleton className="h-[300px]" />
    </div>
  )
}


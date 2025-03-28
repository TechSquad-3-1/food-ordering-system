"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Receipt,
  User,
  Utensils,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  CircleDashed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Types
interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  subtotal: number
}

interface Order {
  id: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  restaurant: {
    id: string
    name: string
    address: string
    phone: string
  }
  delivery: {
    id: string
    person: string
    estimatedTime: string
    actualTime: string | null
    status: "assigned" | "picked_up" | "in_transit" | "delivered" | "failed"
  } | null
  items: OrderItem[]
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  paymentMethod: "credit_card" | "cash" | "wallet"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  subtotal: number
  deliveryFee: number
  tax: number
  tip: number
  total: number
  createdAt: string
  updatedAt: string
  specialInstructions: string | null
}

export default function OrderDetails() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    // Simulate fetching order data
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch(`/api/orders/${orderId}`)
        // const data = await response.json()

        // Simulated data for demonstration
        setTimeout(() => {
          const mockOrder: Order = {
            id: orderId,
            customer: {
              id: "cust-123",
              name: "Sarah Johnson",
              email: "sarah.j@example.com",
              phone: "+1 (555) 123-4567",
            },
            restaurant: {
              id: "rest-456",
              name: "Burger Palace",
              address: "123 Main St, Anytown, CA 94321",
              phone: "+1 (555) 987-6543",
            },
            delivery: {
              id: "del-789",
              person: "Michael Rodriguez",
              estimatedTime: "2023-04-15T18:30:00Z",
              actualTime: null,
              status: "in_transit",
            },
            items: [
              {
                id: "item-1",
                name: "Double Cheeseburger",
                quantity: 2,
                price: 8.99,
                subtotal: 17.98,
              },
              {
                id: "item-2",
                name: "Large Fries",
                quantity: 1,
                price: 3.99,
                subtotal: 3.99,
              },
              {
                id: "item-3",
                name: "Chocolate Milkshake",
                quantity: 2,
                price: 4.5,
                subtotal: 9.0,
              },
            ],
            status: "out_for_delivery",
            paymentMethod: "credit_card",
            paymentStatus: "paid",
            subtotal: 30.97,
            deliveryFee: 2.99,
            tax: 2.79,
            tip: 5.0,
            total: 41.75,
            createdAt: "2023-04-15T17:45:00Z",
            updatedAt: "2023-04-15T18:00:00Z",
            specialInstructions: "Please include extra ketchup packets.",
          }

          setOrder(mockOrder)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching order:", error)
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return

    setUpdatingStatus(true)
    try {
      // In a real app, you would call your API
      // await fetch(`/api/orders/${orderId}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setOrder({
        ...order,
        status: newStatus as Order["status"],
        updatedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <CircleDashed className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />
      case "preparing":
        return <Utensils className="h-4 w-4" />
      case "ready":
        return <Package className="h-4 w-4" />
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "confirmed":
        return "bg-blue-500"
      case "preparing":
        return "bg-purple-500"
      case "ready":
        return "bg-indigo-500"
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

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "paid":
        return "bg-green-500"
      case "refunded":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (!order) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle>Order Not Found</CardTitle>
          <CardDescription>The requested order could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
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
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue={order.status} onValueChange={handleStatusChange} disabled={updatingStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Print Receipt</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(order.status)} text-white`}>
                {getStatusIcon(order.status)}
                <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
              </Badge>
              <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-white`}>
                <span className="capitalize">{order.paymentStatus}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Ordered: {new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Last Updated: {new Date(order.updatedAt).toLocaleString()}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {order.specialInstructions && (
              <div className="bg-muted p-3 rounded-md">
                <h3 className="font-medium mb-1">Special Instructions</h3>
                <p className="text-sm">{order.specialInstructions}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tip</span>
                <span>${order.tip.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <Link href={`/admin/users/${order.customer.id}`} className="font-medium hover:underline">
                  {order.customer.name}
                </Link>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{order.customer.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Restaurant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                <Link href={`/admin/restaurants/${order.restaurant.id}`} className="font-medium hover:underline">
                  {order.restaurant.name}
                </Link>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{order.restaurant.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{order.restaurant.phone}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
              </div>
              <div className="flex items-center">
                <Receipt className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  Status: <span className="capitalize">{order.paymentStatus}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {order.delivery && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Link href={`/admin/delivery/${order.delivery.id}`} className="font-medium hover:underline">
                    {order.delivery.person}
                  </Link>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Estimated: {new Date(order.delivery.estimatedTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Badge className="capitalize">{order.delivery.status.replace("_", " ")}</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-[180px]" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-[600px] md:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[150px]" />
        </div>
      </div>
    </div>
  )
}


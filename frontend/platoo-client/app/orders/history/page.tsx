"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Receipt, ExternalLink, Download, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// Interface definitions for order and order items
interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  status: "Pending" | "Preparing" | "On the way" | "Delivered" | "Cancelled" | "Ready"
  items: OrderItem[]
  address: string
  deliveryTime: string
  total: number
  restaurantName: string
  restaurantImage: string
  restaurantRating: number
}

interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
}

export default function OrderHistoryPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [restaurantData, setRestaurantData] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loggedInUserId = localStorage.getItem("userId") // Retrieve the logged-in user's ID

  useEffect(() => {
    if (!loggedInUserId) {
      setIsLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3008/api/orders/history/${loggedInUserId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const orders = await response.json()

        // Fetch all restaurant data
        const restaurantResponse = await fetch("http://localhost:3001/api/restaurants")
        if (!restaurantResponse.ok) {
          throw new Error("Failed to fetch restaurants")
        }
        const restaurants = await restaurantResponse.json()

        // Map the fetched orders to match the expected format
        const mappedOrders: Order[] = orders.map((order: any) => {
          const restaurant = restaurants.find((r: any) => r.id === order.restaurant_id)
          return {
            id: order.order_id,
            date: new Date(order.createdAt).toLocaleString(),
            status: order.status,
            items: order.items.map((item: any) => ({
              name: `Item ID: ${item.menu_item_id}`, // Placeholder for item name
              quantity: item.quantity,
              price: item.price,
            })),
            address: "Not available", // Placeholder for address
            deliveryTime: "TBD", // Placeholder for delivery time
            total: order.total_amount + order.delivery_fee, // Calculate total price
            restaurantName: restaurant ? restaurant.name : "Unknown",
            restaurantImage: restaurant ? restaurant.image : "/placeholder.svg", // Fallback image
            restaurantRating: restaurant ? restaurant.rating : 0, // Fallback rating
          }
        })

        setAllOrders(mappedOrders)
        setFilteredOrders(mappedOrders) // Initially set to all orders

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [loggedInUserId])

  const filterOrdersByStatus = (status: string) => {
    if (status === "all") {
      setFilteredOrders(allOrders)
    } else {
      setFilteredOrders(allOrders.filter((order) => order.status.toLowerCase() === status.toLowerCase()))
    }
  }

  if (isLoading) {
    return (
      <div>
        <Header cartCount={1} />
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500">Loading orders...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header cartCount={1} />
      <div className="container py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-gray-500">View and manage your past orders</p>
          </div>

          <Tabs defaultValue="all" onValueChange={filterOrdersByStatus}>
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="preparing">Preparing</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="all" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="preparing" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="ready" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
              <TabsContent value="cancelled" className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
          <Badge
            className={
              order.status === "Delivered"
                ? "bg-green-500"
                : order.status === "Cancelled"
                ? "bg-red-500"
                : order.status === "Pending"
                ? "bg-yellow-500"
                : "bg-orange-500"
            }
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={order.restaurantImage || "/placeholder.svg"}
                alt={order.restaurantName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{order.restaurantName}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
                <span>{order.restaurantRating}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <Receipt className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Order Items</p>
                <ul className="text-sm text-gray-500">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Delivery Address</p>
                <p className="text-sm text-gray-500">{order.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Delivery Time</p>
                <p className="text-sm text-gray-500">{order.deliveryTime}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Receipt
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/orders/track/${order.id}`}>
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

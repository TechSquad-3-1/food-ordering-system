import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Receipt, ExternalLink, Download, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function OrderHistoryPage() {
  return (
    <div>
        <Header cartCount={1}/>
        <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-gray-500">View and manage your past orders</p>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="all" className="space-y-4">
              {[...completedOrders, ...cancelledOrders]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </TabsContent>
            <TabsContent value="cancelled" className="space-y-4">
              {cancelledOrders.map((order) => (
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

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  date: string
  status: "Preparing" | "On the way" | "Delivered" | "Cancelled"
  items: OrderItem[]
  address: string
  deliveryTime: string
  total: number
  restaurantName: string
  restaurantImage: string
  restaurantRating: number
}

const completedOrders: Order[] = [
  {
    id: "ORD-7801",
    date: "March 18, 2025 - 7:45 PM",
    status: "Delivered",
    items: [
      { name: "Vegetable Curry", quantity: 1, price: 13.99 },
      { name: "Garlic Naan", quantity: 2, price: 2.99 },
      { name: "Mango Lassi", quantity: 1, price: 3.99 },
    ],
    address: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryTime: "Delivered at 8:20 PM",
    total: 23.96,
    restaurantName: "Curry House",
    restaurantImage: "/placeholder.svg?height=300&width=500",
    restaurantRating: 4.6,
  },
  {
    id: "ORD-7790",
    date: "March 15, 2025 - 1:30 PM",
    status: "Delivered",
    items: [
      { name: "California Roll", quantity: 2, price: 8.99 },
      { name: "Miso Soup", quantity: 2, price: 2.99 },
      { name: "Green Tea", quantity: 2, price: 1.99 },
    ],
    address: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryTime: "Delivered at 2:05 PM",
    total: 29.94,
    restaurantName: "Sushi Spot",
    restaurantImage: "/placeholder.svg?height=300&width=500",
    restaurantRating: 4.7,
  },
  {
    id: "ORD-7785",
    date: "March 10, 2025 - 6:15 PM",
    status: "Delivered",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Garlic Bread", quantity: 1, price: 4.99 },
      { name: "Tiramisu", quantity: 1, price: 6.99 },
    ],
    address: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryTime: "Delivered at 6:50 PM",
    total: 24.97,
    restaurantName: "Pizza Palace",
    restaurantImage: "/placeholder.svg?height=300&width=500",
    restaurantRating: 4.8,
  },
]

const cancelledOrders: Order[] = [
  {
    id: "ORD-7795",
    date: "March 16, 2025 - 8:15 PM",
    status: "Cancelled",
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
      { name: "Garlic Bread", quantity: 1, price: 4.99 },
      { name: "Coca Cola", quantity: 2, price: 1.99 },
    ],
    address: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryTime: "Cancelled at 8:20 PM",
    total: 23.96,
    restaurantName: "Pizza Palace",
    restaurantImage: "/placeholder.svg?height=300&width=500",
    restaurantRating: 4.8,
  },
]

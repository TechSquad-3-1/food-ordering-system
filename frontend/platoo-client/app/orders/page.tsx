import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Receipt, ExternalLink } from "lucide-react"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function OrdersPage() {
  return (
    <div>
        <Header cartCount={1} />
        <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-gray-500">Track and manage your orders</p>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="active" className="space-y-4">
              {activeOrders.map((order) => (
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
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-sm text-gray-500">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
            <Link href={`/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                View Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
  estimatedDelivery: string
  total: number
}

const activeOrders: Order[] = [
  {
    id: "ORD-7829",
    date: "March 20, 2025 - 12:30 PM",
    status: "Preparing",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Chicken Biryani", quantity: 1, price: 14.99 },
    ],
    address: "123 Main St, Apt 4B, New York, NY 10001",
    estimatedDelivery: "Today, 1:00 PM - 1:30 PM",
    total: 30.97,
  },
  {
    id: "ORD-7830",
    date: "March 20, 2025 - 1:15 PM",
    status: "On the way",
    items: [
      { name: "Beef Burger", quantity: 2, price: 9.99 },
      { name: "French Fries", quantity: 1, price: 3.99 },
      { name: "Chocolate Milkshake", quantity: 2, price: 4.99 },
    ],
    address: "456 Park Ave, Suite 10, New York, NY 10022",
    estimatedDelivery: "Today, 1:45 PM - 2:15 PM",
    total: 38.94,
  },
]

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
    estimatedDelivery: "Delivered at 8:20 PM",
    total: 23.96,
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
    estimatedDelivery: "Delivered at 2:05 PM",
    total: 29.94,
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
    estimatedDelivery: "Cancelled at 8:20 PM",
    total: 23.96,
  },
]

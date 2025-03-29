"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ChefHat,
  Package,
  Truck,
} from "lucide-react"

// Mock data for orders
const orders = [
  {
    id: "ORD-7893",
    customer: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "123 Main St, Apt 4B",
    },
    items: [
      { name: "Margherita Pizza", quantity: 1, price: "$12.99" },
      { name: "Caesar Salad", quantity: 1, price: "$8.99" },
      { name: "Garlic Bread", quantity: 1, price: "$4.99" },
      { name: "Soda", quantity: 2, price: "$3.99" },
    ],
    total: "$34.95",
    status: "preparing",
    time: "10 mins ago",
    payment: "Credit Card",
    delivery: "Delivery",
  },
  {
    id: "ORD-7894",
    customer: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "456 Oak Ave",
    },
    items: [
      { name: "Chicken Alfredo", quantity: 1, price: "$15.99" },
      { name: "Garlic Knots", quantity: 1, price: "$5.99" },
    ],
    total: "$21.98",
    status: "ready",
    time: "15 mins ago",
    payment: "PayPal",
    delivery: "Pickup",
  },
  {
    id: "ORD-7895",
    customer: {
      name: "Sophia Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "789 Pine Blvd, Suite 3C",
    },
    items: [
      { name: "Vegetable Stir Fry", quantity: 1, price: "$13.99" },
      { name: "Spring Rolls", quantity: 2, price: "$6.99" },
      { name: "Iced Tea", quantity: 1, price: "$2.99" },
    ],
    total: "$30.96",
    status: "preparing",
    time: "20 mins ago",
    payment: "Cash",
    delivery: "Delivery",
  },
  {
    id: "ORD-7896",
    customer: {
      name: "James Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "321 Elm St",
    },
    items: [
      { name: "Cheeseburger", quantity: 1, price: "$9.99" },
      { name: "French Fries", quantity: 1, price: "$2.99" },
    ],
    total: "$12.98",
    status: "ready",
    time: "25 mins ago",
    payment: "Credit Card",
    delivery: "Pickup",
  },
  {
    id: "ORD-7897",
    customer: {
      name: "Olivia Martinez",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "567 Maple Dr",
    },
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: "$14.99" },
      { name: "Buffalo Wings", quantity: 1, price: "$10.99" },
      { name: "Chocolate Cake", quantity: 1, price: "$6.99" },
    ],
    total: "$32.97",
    status: "delivered",
    time: "35 mins ago",
    payment: "Credit Card",
    delivery: "Delivery",
  },
  {
    id: "ORD-7898",
    customer: {
      name: "Noah Taylor",
      avatar: "/placeholder.svg?height=32&width=32",
      address: "890 Cedar Ln",
    },
    items: [
      { name: "Spaghetti Bolognese", quantity: 1, price: "$13.99" },
      { name: "Tiramisu", quantity: 1, price: "$7.99" },
    ],
    total: "$21.98",
    status: "cancelled",
    time: "40 mins ago",
    payment: "PayPal",
    delivery: "Delivery",
  },
]

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    if (selectedTab !== "all" && order.status !== selectedTab) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.total.toLowerCase().includes(query)
      )
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "preparing":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <ChefHat className="mr-1 h-3 w-3" /> Preparing
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            <Package className="mr-1 h-3 w-3" /> Ready
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <CheckCircle className="mr-1 h-3 w-3" /> Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" /> {status}
          </Badge>
        )
    }
  }

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the order status in the database
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track all your restaurant orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>New Order</Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4" onValueChange={setSelectedTab}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-[200px] sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value={selectedTab} className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Order List</CardTitle>
              <CardDescription>{filteredOrders.length} orders found</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                            <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{order.customer.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.time}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {order.delivery === "Delivery" ? (
                            <Truck className="mr-1 h-3 w-3" />
                          ) : (
                            <Package className="mr-1 h-3 w-3" />
                          )}
                          {order.delivery}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>View details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "preparing")}>
                              Mark as Preparing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "ready")}>
                              Mark as Ready
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "delivered")}>
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "cancelled")}>
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No orders found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>1</strong> to <strong>{filteredOrders.length}</strong> of{" "}
                  <strong>{filteredOrders.length}</strong> orders
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8">
                    1
                  </Button>
                  <Button variant="outline" size="icon" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder?.time} • {getStatusBadge(selectedOrder?.status || "")}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Customer Information</h3>
                <div className="flex items-center gap-3 p-3 border rounded-md">
                  <Avatar>
                    <AvatarImage src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} />
                    <AvatarFallback>{selectedOrder.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedOrder.customer.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedOrder.customer.address}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{item.price}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{selectedOrder.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="p-3 border rounded-md">{selectedOrder.payment}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Delivery Method</h3>
                  <div className="p-3 border rounded-md">{selectedOrder.delivery}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Update Status</h3>
                <Select defaultValue={selectedOrder.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


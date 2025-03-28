"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MoreHorizontal,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Store,
  Truck,
  FileText,
  Printer,
  MapPin,
} from "lucide-react"

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: {
    id: string
    name: string
    email: string
    address: string
    phone: string
  }
  restaurant: {
    id: string
    name: string
    address: string
  }
  items: OrderItem[]
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  deliveryPerson?: {
    id: string
    name: string
    phone: string
  }
  orderDate: string
  deliveryDate?: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false)

  useEffect(() => {
    // In a real app, fetch orders from API
    // For demo purposes, we'll use mock data
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockOrders: Order[] = [
          {
            id: "ORD-5001",
            customer: {
              id: "USR-1001",
              name: "John Doe",
              email: "john.d@example.com",
              address: "123 Main St, Apt 4B, Washington, DC 20001",
              phone: "+1 (202) 555-1234",
            },
            restaurant: {
              id: "RES-1001",
              name: "Burger Palace",
              address: "456 Market St, Washington, DC 20002",
            },
            items: [
              { id: "ITEM-1", name: "Classic Cheeseburger", quantity: 2, price: 8.99 },
              { id: "ITEM-2", name: "French Fries", quantity: 1, price: 3.99 },
              { id: "ITEM-3", name: "Soda", quantity: 2, price: 1.99 },
            ],
            total: 25.95,
            status: "delivered",
            paymentStatus: "paid",
            paymentMethod: "credit_card",
            deliveryPerson: {
              id: "USR-1003",
              name: "Lisa Wong",
              phone: "+1 (202) 555-5678",
            },
            orderDate: "2023-04-15T14:30:00Z",
            deliveryDate: "2023-04-15T15:15:00Z",
          },
          {
            id: "ORD-5002",
            customer: {
              id: "USR-1005",
              name: "Jane Smith",
              email: "jane.s@example.com",
              address: "789 Oak St, Apt 7B, Washington, DC 20003",
              phone: "+1 (202) 555-2345",
            },
            restaurant: {
              id: "RES-1002",
              name: "Pizza Heaven",
              address: "321 Park Ave, Washington, DC 20004",
            },
            items: [
              { id: "ITEM-4", name: "Pepperoni Pizza (Large)", quantity: 1, price: 16.99 },
              { id: "ITEM-5", name: "Garlic Bread", quantity: 1, price: 4.99 },
              { id: "ITEM-6", name: "Soda", quantity: 2, price: 1.99 },
            ],
            total: 25.96,
            status: "out_for_delivery",
            paymentStatus: "paid",
            paymentMethod: "credit_card",
            deliveryPerson: {
              id: "USR-1008",
              name: "Daniel Lee",
              phone: "+1 (202) 555-6789",
            },
            orderDate: "2023-04-15T16:45:00Z",
          },
          {
            id: "ORD-5003",
            customer: {
              id: "USR-1009",
              name: "Robert Johnson",
              email: "robert.j@example.com",
              address: "456 Pine St, Washington, DC 20005",
              phone: "+1 (202) 555-3456",
            },
            restaurant: {
              id: "RES-1003",
              name: "Sushi Express",
              address: "789 Center St, Washington, DC 20006",
            },
            items: [
              { id: "ITEM-7", name: "California Roll", quantity: 2, price: 8.99 },
              { id: "ITEM-8", name: "Miso Soup", quantity: 1, price: 3.99 },
              { id: "ITEM-9", name: "Green Tea", quantity: 1, price: 2.99 },
            ],
            total: 24.96,
            status: "preparing",
            paymentStatus: "paid",
            paymentMethod: "paypal",
            orderDate: "2023-04-15T17:15:00Z",
          },
          {
            id: "ORD-5004",
            customer: {
              id: "USR-1012",
              name: "Emily Brown",
              email: "emily.b@example.com",
              address: "123 Elm St, Washington, DC 20007",
              phone: "+1 (202) 555-4567",
            },
            restaurant: {
              id: "RES-1004",
              name: "Taco Time",
              address: "456 West St, Washington, DC 20008",
            },
            items: [
              { id: "ITEM-10", name: "Taco Combo", quantity: 1, price: 12.99 },
              { id: "ITEM-11", name: "Nachos", quantity: 1, price: 7.99 },
              { id: "ITEM-12", name: "Soda", quantity: 1, price: 1.99 },
            ],
            total: 22.97,
            status: "pending",
            paymentStatus: "pending",
            paymentMethod: "cash",
            orderDate: "2023-04-15T18:00:00Z",
          },
          {
            id: "ORD-5005",
            customer: {
              id: "USR-1015",
              name: "Michael Wilson",
              email: "michael.w@example.com",
              address: "789 Maple St, Washington, DC 20009",
              phone: "+1 (202) 555-5678",
            },
            restaurant: {
              id: "RES-1005",
              name: "Pasta Place",
              address: "123 North St, Washington, DC 20010",
            },
            items: [
              { id: "ITEM-13", name: "Spaghetti Bolognese", quantity: 1, price: 14.99 },
              { id: "ITEM-14", name: "Garlic Bread", quantity: 1, price: 4.99 },
              { id: "ITEM-15", name: "Tiramisu", quantity: 1, price: 6.99 },
            ],
            total: 26.97,
            status: "cancelled",
            paymentStatus: "refunded",
            paymentMethod: "credit_card",
            orderDate: "2023-04-14T15:00:00Z",
          },
          {
            id: "ORD-5006",
            customer: {
              id: "USR-1018",
              name: "Sarah Johnson",
              email: "sarah.j@example.com",
              address: "456 Cedar St, Washington, DC 20011",
              phone: "+1 (202) 555-6789",
            },
            restaurant: {
              id: "RES-1006",
              name: "Burger Palace",
              address: "456 Market St, Washington, DC 20002",
            },
            items: [
              { id: "ITEM-16", name: "Double Bacon Burger", quantity: 1, price: 12.99 },
              { id: "ITEM-17", name: "Onion Rings", quantity: 1, price: 4.99 },
              { id: "ITEM-18", name: "Milkshake", quantity: 1, price: 5.99 },
            ],
            total: 23.97,
            status: "delivered",
            paymentStatus: "paid",
            paymentMethod: "credit_card",
            deliveryPerson: {
              id: "USR-1003",
              name: "Lisa Wong",
              phone: "+1 (202) 555-5678",
            },
            orderDate: "2023-04-14T12:30:00Z",
            deliveryDate: "2023-04-14T13:15:00Z",
          },
        ]

        setOrders(mockOrders)
        setFilteredOrders(mockOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    // Apply filters whenever filter criteria change
    applyFilters()
  }, [searchQuery, statusFilter, paymentStatusFilter, orders])

  const applyFilters = () => {
    let filtered = [...orders]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.restaurant.name.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter((order) => order.paymentStatus === paymentStatusFilter)
    }

    setFilteredOrders(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "preparing":
        return "bg-blue-500"
      case "ready":
        return "bg-purple-500"
      case "out_for_delivery":
        return "bg-indigo-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "refunded":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusName = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">Track and manage all orders across your platform</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:max-w-sm">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.restaurant.name}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {getStatusName(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getPaymentStatusColor(order.paymentStatus)} text-white`}>
                          {getStatusName(order.paymentStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedOrder(order)
                                setIsViewOrderOpen(true)
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/orders/${order.id}/edit`)}>
                              <FileText className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {order.status === "pending" && (
                              <DropdownMenuItem className="text-blue-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirm Order
                              </DropdownMenuItem>
                            )}
                            {(order.status === "pending" || order.status === "preparing") && (
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                            {order.status === "delivered" && (
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Receipt
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setPaymentStatusFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* View Order Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order ${selectedOrder.id} placed on ${formatDate(selectedOrder.orderDate)}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
                  <div className="rounded-md border p-3 space-y-1">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{selectedOrder.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedOrder.customer.email}</div>
                        <div className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Restaurant Information</h3>
                  <div className="rounded-md border p-3 space-y-1">
                    <div className="flex items-start gap-2">
                      <Store className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">{selectedOrder.restaurant.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedOrder.restaurant.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Delivery Address</h3>
                  <div className="rounded-md border p-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">{selectedOrder.customer.address}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Order Timeline</h3>
                  <div className="rounded-md border p-3">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="text-sm">
                          <span className="font-medium">Ordered:</span> {formatDate(selectedOrder.orderDate)}
                        </div>
                        {selectedOrder.deliveryDate && (
                          <div className="text-sm">
                            <span className="font-medium">Delivered:</span> {formatDate(selectedOrder.deliveryDate)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Order Items</h3>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Information</h3>
                  <div className="rounded-md border p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">Method:</span>
                      <span className="text-sm font-medium">{getStatusName(selectedOrder.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge className={`${getPaymentStatusColor(selectedOrder.paymentStatus)} text-white`}>
                        {getStatusName(selectedOrder.paymentStatus)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.deliveryPerson && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Delivery Person</h3>
                    <div className="rounded-md border p-3 space-y-1">
                      <div className="flex items-start gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">{selectedOrder.deliveryPerson.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedOrder.deliveryPerson.phone}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(selectedOrder.status)} text-white`}>
                    {getStatusName(selectedOrder.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Current Status</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Edit Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


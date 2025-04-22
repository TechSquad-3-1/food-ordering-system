"use client"

import { JSX, useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChefHat,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react"

interface Order {
  id: string
  customer: {
    name: string
    address: string
  }
  items: { name: string; quantity: number; price: string }[]
  total: string
  status: string
  time: string
  payment: string
  delivery: string
  restaurant_id: string
}

const RESTAURANT_ID = "67ea74a07ec2521671a97f91"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Close dropdown on outside click
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdownId && dropdownRefs.current[openDropdownId]) {
        if (
          dropdownRefs.current[openDropdownId] &&
          !dropdownRefs.current[openDropdownId]!.contains(event.target as Node)
        ) {
          setOpenDropdownId(null)
        }
      }
    }
    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId])

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("http://localhost:3008/api/orders")
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        const mappedOrders: Order[] = data
          .filter((order: any) => order.restaurant_id === RESTAURANT_ID)
          .map((order: any) => ({
            id: order.order_id,
            customer: {
              name: order.email?.split("@")[0] || "Customer",
              address: order.delivery_address || "N/A",
            },
            items: order.items.map((item: any) => ({
              name: item.menu_item_id || "Item",
              quantity: item.quantity,
              price: item.price.toFixed(2),
            })),
            total: order.total_amount.toFixed(2),
            status: order.status,
            time: new Date(order.createdAt).toLocaleString(),
            payment: "Online",
            delivery: "Delivery",
            restaurant_id: order.restaurant_id,
          }))
        setOrders(mappedOrders)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const filteredOrders = orders.filter((order) => {
    if (selectedTab !== "all" && order.status !== selectedTab) return false
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.total.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getStatusBadge = (status: string) => {
    const commonProps = "mr-1 h-3 w-3"
    const badgeMap: Record<string, JSX.Element> = {
      preparing: (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <ChefHat className={commonProps} /> Preparing
        </Badge>
      ),
      ready: (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle className={commonProps} /> Ready
        </Badge>
      ),
      delivered: (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          <CheckCircle className={commonProps} /> Delivered
        </Badge>
      ),
      cancelled: (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          <XCircle className={commonProps} /> Cancelled
        </Badge>
      ),
    }
    return badgeMap[status] || (
      <Badge variant="outline">
        <Clock className={commonProps} /> {status}
      </Badge>
    )
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setSelectedStatus(order.status)
    setIsDetailsOpen(true)
    setOpenDropdownId(null)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:3008/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      )
    } catch (err) {
      console.error("Error updating status", err)
    }
  }

  const handleSentDelivery = async (order: Order) => {
    try {
      const res = await fetch(
        `http://localhost:3008/api/orders/${order.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ready" }),
        }
      )
      if (!res.ok) throw new Error("Failed to update order status")
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, status: "ready" } : o
        )
      )
    } catch (err) {
      console.error(err)
      alert("Could not send order to ready.")
    }
  }

  const handleMarkDelivered = async (order: Order) => {
    try {
      const res = await fetch(
        `http://localhost:3008/api/orders/${order.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "delivered" }),
        }
      )
      if (!res.ok) throw new Error("Failed to update order status")
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, status: "delivered" } : o
        )
      )
    } catch (err) {
      console.error(err)
      alert("Could not mark order as delivered.")
    }
  }

  const handleSaveChanges = () => {
    if (selectedOrder && selectedStatus) {
      handleUpdateStatus(selectedOrder.id, selectedStatus)
      setIsDetailsOpen(false)
    }
  }

  if (loading) return <div className="p-6 text-center">Loading orders...</div>
  if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>

  const tabs = ["all", "pending", "preparing", "ready", "delivered"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all your restaurant orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>New Order</Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="space-y-4"
        onValueChange={setSelectedTab}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            {tabs.map((status) => (
              <TabsTrigger key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-[300px]"
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
              <CardDescription>
                {filteredOrders.length} orders found
              </CardDescription>
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
                    {/* Actions column for all, pending, and preparing tabs */}
                    {(selectedTab === "all" ||
                      selectedTab === "pending" ||
                      selectedTab === "preparing") && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>{order.total}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.time}</TableCell>
                      <TableCell>{order.payment}</TableCell>
                      {/* Actions cell for All tab */}
                      {selectedTab === "all" && (
                        <TableCell className="text-right" style={{ position: "relative" }}>
                          {order.status === "delivered" ? (
                            <CheckCircle className="text-blue-500 mx-auto" size={20} />
                          ) : order.status === "ready" ? (
                            <ChefHat className="text-green-500 mx-auto" size={20} />
                          ) : (
                            <>
                              <button
                                className="p-2 rounded-full hover:bg-gray-100"
                                onClick={() =>
                                  setOpenDropdownId(
                                    openDropdownId === order.id ? null : order.id
                                  )
                                }
                                aria-label="More"
                              >
                                <MoreVertical size={20} />
                              </button>
                              {openDropdownId === order.id && (
                                <div
                                  ref={(el) => {
                                    dropdownRefs.current[order.id] = el
                                  }}
                                  className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg"
                                >
                                  <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => handleViewDetails(order)}
                                  >
                                    View details
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </TableCell>
                      )}
                      {/* Actions cell for Pending tab: three dots */}
                      {selectedTab === "pending" && (
                        <TableCell className="text-right" style={{ position: "relative" }}>
                          <button
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === order.id ? null : order.id
                              )
                            }
                            aria-label="More"
                          >
                            <MoreVertical size={20} />
                          </button>
                          {openDropdownId === order.id && (
                            <div
                              ref={(el) => {
                                dropdownRefs.current[order.id] = el
                              }}
                              className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg"
                            >
                              <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={() => handleViewDetails(order)}
                              >
                                View details
                              </button>
                            </div>
                          )}
                        </TableCell>
                      )}
                      {/* Actions cell for Preparing tab: Sent to Delivery button */}
                      {selectedTab === "preparing" && (
                        <TableCell className="text-right">
                          <Button onClick={() => handleSentDelivery(order)}>
                            Sent to Delivery
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View and update the status of the order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <span className="font-medium">Customer: </span>
                {selectedOrder.customer.name}
              </div>
              <div>
                <span className="font-medium">Address: </span>
                {selectedOrder.customer.address}
              </div>
              <div className="space-y-2">
                <span className="font-medium">Items:</span>
                <ul className="space-y-1">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.name} - {item.price}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span>{selectedOrder.total}</span>
              </div>
              <div>
                <span className="font-medium">Payment Type:</span>{" "}
                {selectedOrder.payment}
              </div>
              <div>
                <span className="font-medium">Delivery Method:</span>{" "}
                {selectedOrder.delivery}
              </div>
              <div>
                <span className="font-medium">Status: </span>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  disabled={selectedOrder.status === "delivered"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedOrder?.status === "preparing"
                      ? ["ready"]
                      : selectedOrder?.status === "ready"
                      ? ["delivered"]
                      : selectedOrder?.status === "pending"
                      ? ["preparing"]
                      : ["pending", "preparing", "ready", "delivered"]
                    ).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={selectedOrder?.status === "delivered"}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

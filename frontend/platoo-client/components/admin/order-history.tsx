"use client"

import { useState } from "react"
import { Search, Download, ArrowUpDown, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"

// Types
interface Order {
  id: string
  restaurantName: string
  customerName: string
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded" | "failed"
  date: string
}

interface OrderHistoryProps {
  userId?: string
  userType?: "customer" | "restaurant_owner" | "delivery_person" | "admin"
  restaurantId?: string
}

export function OrderHistory({ userId, userType, restaurantId }: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "total">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data - in a real app, this would be fetched from an API
  const orders: Order[] = [
    {
      id: "ORD-1234",
      restaurantName: "Burger Palace",
      customerName: "John Smith",
      total: 32.5,
      status: "delivered",
      paymentStatus: "paid",
      date: "2023-04-15T14:30:00Z",
    },
    {
      id: "ORD-1235",
      restaurantName: "Pizza Heaven",
      customerName: "Sarah Johnson",
      total: 45.75,
      status: "out_for_delivery",
      paymentStatus: "paid",
      date: "2023-04-15T16:45:00Z",
    },
    {
      id: "ORD-1236",
      restaurantName: "Sushi Express",
      customerName: "Michael Brown",
      total: 68.2,
      status: "preparing",
      paymentStatus: "paid",
      date: "2023-04-15T17:15:00Z",
    },
    {
      id: "ORD-1237",
      restaurantName: "Taco Time",
      customerName: "Emily Davis",
      total: 22.95,
      status: "confirmed",
      paymentStatus: "pending",
      date: "2023-04-15T18:00:00Z",
    },
    {
      id: "ORD-1238",
      restaurantName: "Burger Palace",
      customerName: "David Wilson",
      total: 29.45,
      status: "cancelled",
      paymentStatus: "refunded",
      date: "2023-04-14T12:30:00Z",
    },
    {
      id: "ORD-1239",
      restaurantName: "Pizza Heaven",
      customerName: "Jennifer Lee",
      total: 52.8,
      status: "delivered",
      paymentStatus: "paid",
      date: "2023-04-14T19:45:00Z",
    },
    {
      id: "ORD-1240",
      restaurantName: "Sushi Express",
      customerName: "Robert Taylor",
      total: 75.6,
      status: "delivered",
      paymentStatus: "paid",
      date: "2023-04-13T20:15:00Z",
    },
  ]

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      let matchesDate = true
      const orderDate = new Date(order.date)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)
      const lastMonth = new Date(today)
      lastMonth.setMonth(lastMonth.getMonth() - 1)

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === today.toDateString()
      } else if (dateFilter === "yesterday") {
        matchesDate = orderDate.toDateString() === yesterday.toDateString()
      } else if (dateFilter === "week") {
        matchesDate = orderDate >= lastWeek
      } else if (dateFilter === "month") {
        matchesDate = orderDate >= lastMonth
      }

      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "total") {
        return sortOrder === "asc" ? a.total - b.total : b.total - a.total
      }
      return 0
    })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (column: "date" | "total") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
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

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="mr-1 h-3 w-3" />
      case "cancelled":
        return <XCircle className="mr-1 h-3 w-3" />
      case "pending":
      case "confirmed":
      case "preparing":
      case "ready":
      case "out_for_delivery":
        return <Clock className="mr-1 h-3 w-3" />
      default:
        return <AlertCircle className="mr-1 h-3 w-3" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          {userType === "customer"
            ? "View your past orders and their status"
            : userType === "restaurant_owner"
              ? "View all orders for your restaurant"
              : "View and manage all orders"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center w-full md:w-auto">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("total")}>
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("date")}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.restaurantName}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(order.status)} text-white`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.replace("_", " ")}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-white`}>
                        <span className="capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(i + 1)
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


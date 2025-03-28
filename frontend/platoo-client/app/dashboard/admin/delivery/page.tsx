"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Filter, MapPin, Clock, Truck, User, Phone, Mail, Calendar, BarChart3, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, AlertCircle, MoreHorizontal, Edit, Trash2, RefreshCw, Download, ChevronDown, ChevronUp, Star, Bike, Car, ShoppingBag, Loader2 } from 'lucide-react'

interface DeliveryPerson {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "inactive" | "on_delivery"
  rating: number
  totalDeliveries: number
  vehicleType: "bike" | "scooter" | "car"
  location?: {
    lat: number
    lng: number
    lastUpdated: string
  }
  avatar?: string
}

interface Delivery {
  id: string
  orderId: string
  restaurantName: string
  customerName: string
  customerAddress: string
  customerPhone: string
  deliveryPersonId?: string
  deliveryPersonName?: string
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "failed"
  estimatedDeliveryTime?: string
  actualDeliveryTime?: string
  distance: number
  createdAt: string
  items: number
  total: number
}

interface DeliveryZone {
  id: string
  name: string
  coverage: string
  deliveryPersonnel: number
  activeDeliveries: number
  averageDeliveryTime: number
  status: "active" | "inactive"
}

interface DeliveryIssue {
  id: string
  deliveryId: string
  orderId: string
  customerName: string
  deliveryPersonName: string
  issueType: "delay" | "wrong_items" | "damaged" | "missing" | "behavior" | "other"
  description: string
  status: "open" | "in_progress" | "resolved"
  priority: "low" | "medium" | "high"
  createdAt: string
  resolvedAt?: string
}

export default function AdminDeliveryDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPerson[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([])
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([])
  const [deliveryIssues, setDeliveryIssues] = useState<DeliveryIssue[]>([])
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null)
  const [showAddDeliveryPersonDialog, setShowAddDeliveryPersonDialog] = useState(false)
  const [deliveryPersonnelFilter, setDeliveryPersonnelFilter] = useState("all")
  const [deliveriesFilter, setDeliveriesFilter] = useState("all")
  const [issuesFilter, setIssuesFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      setDeliveryPersonnel([
        {
          id: "DP-1001",
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          status: "active",
          rating: 4.8,
          totalDeliveries: 342,
          vehicleType: "bike",
          location: {
            lat: 40.7128,
            lng: -74.006,
            lastUpdated: "2023-04-16T14:30:00Z",
          },
        },
        {
          id: "DP-1002",
          name: "Maria Garcia",
          email: "maria.garcia@example.com",
          phone: "+1 (555) 234-5678",
          status: "on_delivery",
          rating: 4.9,
          totalDeliveries: 512,
          vehicleType: "scooter",
          location: {
            lat: 40.7138,
            lng: -74.016,
            lastUpdated: "2023-04-16T14:35:00Z",
          },
        },
        {
          id: "DP-1003",
          name: "David Johnson",
          email: "david.johnson@example.com",
          phone: "+1 (555) 345-6789",
          status: "inactive",
          rating: 4.5,
          totalDeliveries: 187,
          vehicleType: "car",
        },
        {
          id: "DP-1004",
          name: "Sarah Williams",
          email: "sarah.williams@example.com",
          phone: "+1 (555) 456-7890",
          status: "active",
          rating: 4.7,
          totalDeliveries: 276,
          vehicleType: "bike",
          location: {
            lat: 40.7148,
            lng: -74.026,
            lastUpdated: "2023-04-16T14:25:00Z",
          },
        },
        {
          id: "DP-1005",
          name: "Michael Brown",
          email: "michael.brown@example.com",
          phone: "+1 (555) 567-8901",
          status: "on_delivery",
          rating: 4.6,
          totalDeliveries: 423,
          vehicleType: "car",
          location: {
            lat: 40.7158,
            lng: -74.036,
            lastUpdated: "2023-04-16T14:20:00Z",
          },
        },
      ])

      setActiveDeliveries([
        {
          id: "DEL-5001",
          orderId: "ORD-5001",
          restaurantName: "Burger Palace",
          customerName: "John Doe",
          customerAddress: "123 Main St, City, Country",
          customerPhone: "+1 (555) 123-4567",
          deliveryPersonId: "DP-1002",
          deliveryPersonName: "Maria Garcia",
          status: "in_transit",
          estimatedDeliveryTime: "2023-04-16T15:00:00Z",
          distance: 3.2,
          createdAt: "2023-04-16T14:30:00Z",
          items: 3,
          total: 25.95,
        },
        {
          id: "DEL-5002",
          orderId: "ORD-5002",
          restaurantName: "Pizza Heaven",
          customerName: "Jane Smith",
          customerAddress: "456 Oak St, City, Country",
          customerPhone: "+1 (555) 234-5678",
          deliveryPersonId: "DP-1005",
          deliveryPersonName: "Michael Brown",
          status: "picked_up",
          estimatedDeliveryTime: "2023-04-16T15:15:00Z",
          distance: 4.7,
          createdAt: "2023-04-16T14:45:00Z",
          items: 2,
          total: 32.50,
        },
        {
          id: "DEL-5003",
          orderId: "ORD-5003",
          restaurantName: "Sushi Express",
          customerName: "Robert Johnson",
          customerAddress: "789 Pine St, City, Country",
          customerPhone: "+1 (555) 345-6789",
          status: "pending",
          distance: 2.8,
          createdAt: "2023-04-16T14:50:00Z",
          items: 4,
          total: 45.75,
        },
        {
          id: "DEL-5004",
          orderId: "ORD-4998",
          restaurantName: "Taco Fiesta",
          customerName: "Emily Brown",
          customerAddress: "123 Elm St, City, Country",
          customerPhone: "+1 (555) 456-7890",
          deliveryPersonId: "DP-1001",
          deliveryPersonName: "John Smith",
          status: "assigned",
          estimatedDeliveryTime: "2023-04-16T15:30:00Z",
          distance: 1.9,
          createdAt: "2023-04-16T14:40:00Z",
          items: 5,
          total: 37.25,
        },
        {
          id: "DEL-5005",
          orderId: "ORD-4995",
          restaurantName: "Pasta Paradise",
          customerName: "Michael Wilson",
          customerAddress: "456 Maple St, City, Country",
          customerPhone: "+1 (555) 567-8901",
          status: "pending",
          distance: 3.5,
          createdAt: "2023-04-16T14:55:00Z",
          items: 3,
          total: 42.80,
        },
      ])

      setDeliveryZones([
        {
          id: "DZ-1001",
          name: "Downtown",
          coverage: "Central Business District",
          deliveryPersonnel: 12,
          activeDeliveries: 8,
          averageDeliveryTime: 22,
          status: "active",
        },
        {
          id: "DZ-1002",
          name: "North Side",
          coverage: "Residential Area North",
          deliveryPersonnel: 8,
          activeDeliveries: 5,
          averageDeliveryTime: 28,
          status: "active",
        },
        {
          id: "DZ-1003",
          name: "East Side",
          coverage: "University Campus and Surroundings",
          deliveryPersonnel: 10,
          activeDeliveries: 7,
          averageDeliveryTime: 25,
          status: "active",
        },
        {
          id: "DZ-1004",
          name: "South Side",
          coverage: "Industrial Area and Suburbs",
          deliveryPersonnel: 6,
          activeDeliveries: 3,
          averageDeliveryTime: 32,
          status: "active",
        },
        {
          id: "DZ-1005",
          name: "West Side",
          coverage: "Shopping District and Entertainment",
          deliveryPersonnel: 9,
          activeDeliveries: 6,
          averageDeliveryTime: 24,
          status: "active",
        },
      ])

      setDeliveryIssues([
        {
          id: "DI-1001",
          deliveryId: "DEL-4990",
          orderId: "ORD-4990",
          customerName: "Alice Johnson",
          deliveryPersonName: "John Smith",
          issueType: "delay",
          description: "Delivery was 45 minutes late without any updates",
          status: "open",
          priority: "medium",
          createdAt: "2023-04-16T13:30:00Z",
        },
        {
          id: "DI-1002",
          deliveryId: "DEL-4985",
          orderId: "ORD-4985",
          customerName: "Bob Williams",
          deliveryPersonName: "Maria Garcia",
          issueType: "wrong_items",
          description: "Customer received incorrect items in their order",
          status: "in_progress",
          priority: "high",
          createdAt: "2023-04-16T12:45:00Z",
        },
        {
          id: "DI-1003",
          deliveryId: "DEL-4982",
          orderId: "ORD-4982",
          customerName: "Charlie Brown",
          deliveryPersonName: "David Johnson",
          issueType: "damaged",
          description: "Food containers were damaged and leaking",
          status: "resolved",
          priority: "medium",
          createdAt: "2023-04-16T11:30:00Z",
          resolvedAt: "2023-04-16T13:15:00Z",
        },
        {
          id: "DI-1004",
          deliveryId: "DEL-4978",
          orderId: "ORD-4978",
          customerName: "Diana Miller",
          deliveryPersonName: "Sarah Williams",
          issueType: "behavior",
          description: "Delivery person was rude according to customer",
          status: "in_progress",
          priority: "high",
          createdAt: "2023-04-16T10:15:00Z",
        },
        {
          id: "DI-1005",
          deliveryId: "DEL-4975",
          orderId: "ORD-4975",
          customerName: "Edward Davis",
          deliveryPersonName: "Michael Brown",
          issueType: "missing",
          description: "One item was missing from the order",
          status: "resolved",
          priority: "low",
          createdAt: "2023-04-16T09:30:00Z",
          resolvedAt: "2023-04-16T11:45:00Z",
        },
      ])

      setIsLoading(false)
    }, 1500)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "on_delivery":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "assigned":
        return "bg-purple-500"
      case "picked_up":
        return "bg-indigo-500"
      case "in_transit":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "open":
        return "bg-red-500"
      case "in_progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike":
        return <Bike className="h-4 w-4" />
      case "scooter":
        return <Bike className="h-4 w-4" />
      case "car":
        return <Car className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case "delay":
        return <Clock className="h-4 w-4" />
      case "wrong_items":
        return <ShoppingBag className="h-4 w-4" />
      case "damaged":
        return <AlertCircle className="h-4 w-4" />
      case "missing":
        return <Search className="h-4 w-4" />
      case "behavior":
        return <User className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredDeliveryPersonnel = deliveryPersonnel.filter((person) => {
    if (deliveryPersonnelFilter !== "all" && person.status !== deliveryPersonnelFilter) {
      return false
    }
    if (searchQuery) {
      return (
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phone.includes(searchQuery)
      )
    }
    return true
  })

  const filteredDeliveries = activeDeliveries.filter((delivery) => {
    if (deliveriesFilter !== "all" && delivery.status !== deliveriesFilter) {
      return false
    }
    if (searchQuery) {
      return (
        delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (delivery.deliveryPersonName && delivery.deliveryPersonName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    return true
  })

  const filteredIssues = deliveryIssues.filter((issue) => {
    if (issuesFilter !== "all" && issue.status !== issuesFilter) {
      return false
    }
    if (searchQuery) {
      return (
        issue.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.deliveryPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Delivery Management</h1>
        <p className="text-muted-foreground">
          Manage delivery personnel, track active deliveries, and handle delivery issues.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Delivery Personnel</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryPersonnel.length}</div>
            <p className="text-xs text-muted-foreground">
              {deliveryPersonnel.filter((p) => p.status === "active").length} active,{" "}
              {deliveryPersonnel.filter((p) => p.status === "on_delivery").length} on delivery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliveries.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeDeliveries.filter((d) => d.status === "pending").length} pending,{" "}
              {activeDeliveries.filter((d) => ["assigned", "picked_up", "in_transit"].includes(d.status)).length} in
              progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Zones</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryZones.length}</div>
            <p className="text-xs text-muted-foreground">
              {deliveryZones.filter((z) => z.status === "active").length} active zones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deliveryIssues.filter((i) => i.status !== "resolved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {deliveryIssues.filter((i) => i.priority === "high" && i.status !== "resolved").length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personnel">Delivery Personnel</TabsTrigger>
          <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
          <TabsTrigger value="zones">Delivery Zones</TabsTrigger>
          <TabsTrigger value="issues">Delivery Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="personnel" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search personnel..."
                  className="pl-8 w-[250px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={deliveryPersonnelFilter} onValueChange={setDeliveryPersonnelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_delivery">On Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowAddDeliveryPersonDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Delivery Person
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveryPersonnel.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={person.avatar || "/placeholder.svg?height=32&width=32"} alt={person.name} />
                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{person.name}</div>
                            <div className="text-xs text-muted-foreground">{person.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{person.phone}</span>
                          </div>
                          {person.location && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>Updated {new Date(person.location.lastUpdated).toLocaleTimeString()}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(person.status)} text-white`}>
                          {person.status === "active"
                            ? "Active"
                            : person.status === "inactive"
                            ? "Inactive"
                            : "On Delivery"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getVehicleIcon(person.vehicleType)}
                          <span className="capitalize">{person.vehicleType}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{person.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>{person.totalDeliveries}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedDeliveryPerson(person)}>
                            View Details
                          </Button>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search deliveries..."
                  className="pl-8 w-[250px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={deliveriesFilter} onValueChange={setDeliveriesFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Delivery Person</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.orderId}</TableCell>
                      <TableCell>{delivery.restaurantName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{delivery.customerName}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{delivery.customerAddress}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {delivery.deliveryPersonName ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{delivery.deliveryPersonName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{delivery.deliveryPersonName}</span>
                          </div>
                        ) : (
                          <Badge variant="outline">Unassigned</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(delivery.status)} text-white`}>
                          {delivery.status === "pending"
                            ? "Pending"
                            : delivery.status === "assigned"
                            ? "Assigned"
                            : delivery.status === "picked_up"
                            ? "Picked Up"
                            : delivery.status === "in_transit"
                            ? "In Transit"
                            : delivery.status === "delivered"
                            ? "Delivered"
                            : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell>{delivery.distance} km</TableCell>
                      <TableCell>{new Date(delivery.createdAt).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {delivery.status === "pending" && (
                            <Button size="sm">Assign</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search zones..."
                  className="pl-8 w-[250px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Zone
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Zone ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Personnel</TableHead>
                    <TableHead>Active Deliveries</TableHead>
                    <TableHead>Avg. Delivery Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryZones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell className="font-medium">{zone.id}</TableCell>
                      <TableCell>{zone.name}</TableCell>
                      <TableCell>{zone.coverage}</TableCell>
                      <TableCell>{zone.deliveryPersonnel}</TableCell>
                      <TableCell>{zone.activeDeliveries}</TableCell>
                      <TableCell>{zone.averageDeliveryTime} min</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(zone.status)} text-white`}>
                          {zone.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search issues..."
                  className="pl-8 w-[250px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={issuesFilter} onValueChange={setIssuesFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Delivery Person</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>{issue.orderId}</TableCell>
                      <TableCell>{issue.customerName}</TableCell>
                      <TableCell>{issue.deliveryPersonName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getIssueTypeIcon(issue.issueType)}
                          <span className="capitalize">
                            {issue.issueType.replace("_", " ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(issue.priority)} text-white`}>
                          {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(issue.status)} text-white`}>
                          {issue.status === "open"
                            ? "Open"
                            : issue.status === "in_progress"
                            ? "In Progress"
                            : "Resolved"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(issue.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {issue.status !== "resolved" && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="mr-2 h-4 w-4" /> Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Delivery Person Dialog */}
      <Dialog open={showAddDeliveryPersonDialog} onOpenChange={setShowAddDeliveryPersonDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Delivery Person</DialogTitle>
            <DialogDescription>
              Add a new delivery person to the system. They will be able to accept and deliver orders.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="Full name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" type="email" placeholder="Email address" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input id="phone" placeholder="Phone number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle" className="text-right">
                Vehicle
              </Label>
              <Select defaultValue="bike">
                <SelectTrigger className="col-span-3" id="vehicle">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bike">Bike</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox id="active" defaultChecked />
                <label
                  htmlFor="active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDeliveryPersonDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Delivery Person</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delivery Person Details Dialog */}
      {selectedDeliveryPerson && (
        <Dialog open={!!selectedDeliveryPerson} onOpenChange={() => setSelectedDeliveryPerson(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Delivery Person Details</DialogTitle>
              <DialogDescription>
                View and manage details for {selectedDeliveryPerson.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedDeliveryPerson.avatar || "/placeholder.svg?height=64&width=64"}
                    alt={selectedDeliveryPerson.name}
                  />
                  <AvatarFallback>{selectedDeliveryPerson.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDeliveryPerson.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDeliveryPerson.id}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge className={`${getStatusColor(selectedDeliveryPerson.status)} text-white`}>
                      {selectedDeliveryPerson.status === "active"
                        ? "Active"
                        : selectedDeliveryPerson.status === "inactive"
                        ? "Inactive"
                        : "On Delivery"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedDeliveryPerson.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium">Contact Information</h4>
                  <div className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDeliveryPerson.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDeliveryPerson.phone}</span>
                    </div>
                    {selectedDeliveryPerson.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Last updated: {new Date(selectedDeliveryPerson.location.lastUpdated).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">Delivery Information</h4>
                  <div className="space-y-2 rounded-md border p-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span>Total Deliveries: {selectedDeliveryPerson.totalDeliveries}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getVehicleIcon(selectedDeliveryPerson.vehicleType)}
                      <span>Vehicle: {selectedDeliveryPerson.vehicleType.charAt(0).toUpperCase() + selectedDeliveryPerson.vehicleType.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined: January 15, 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-medium">Performance Metrics</h4>
                <div className="space-y-4 rounded-md border p-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">On-time Delivery Rate</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="text-sm font-medium">4.8/5.0</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm">Order Acceptance Rate</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                {selectedDeliveryPerson.status === "active" ? (
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                    <XCircle className="mr-2 h-4 w-4" /> Deactivate
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-green-500 hover:text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" /> Activate
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedDeliveryPerson(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

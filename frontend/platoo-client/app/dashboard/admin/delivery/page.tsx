"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, MapPin, Truck, User, Phone, Mail, Calendar, Star, Bike, Car, MoreHorizontal, Edit, XCircle, CheckCircle, RefreshCw, ShoppingBag } from 'lucide-react'

interface DeliveryPerson {
  id: string
  name?: string
  email?: string
  phone?: string
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
  deliveryStatus: string
  assignedTo?: string | null
  pickupTime: string
  deliveryTime: string
  createdAt: string
  updatedAt: string
}

export default function AdminDeliveryDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPerson[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([])
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null)
  const [showAddDeliveryPersonDialog, setShowAddDeliveryPersonDialog] = useState(false)
  const [deliveryPersonnelFilter, setDeliveryPersonnelFilter] = useState("all")
  const [deliveriesFilter, setDeliveriesFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch delivery personnel from backend
  useEffect(() => {
    async function fetchDeliveryPersonnel() {
      try {
        const res = await fetch("http://localhost:3003/api/delivery")
        const data = await res.json()
        setDeliveryPersonnel(data.map((item: any) => ({
          id: item._id || item.id,
          name: item.name || "",
          email: item.email || "",
          phone: item.phone || "",
          status: item.status || "inactive",
          rating: item.rating ?? 4.5,
          totalDeliveries: item.totalDeliveries ?? 0,
          vehicleType: item.vehicleType || "bike",
          location: item.location,
          avatar: item.avatar
        })))
      } catch (e) {
        setDeliveryPersonnel([])
      }
    }
    fetchDeliveryPersonnel()
  }, [])

  // Fetch deliveries from backend and map to UI format
  useEffect(() => {
    async function fetchDeliveries() {
      setIsLoading(true)
      try {
        const res = await fetch("http://localhost:3003/api/delivery");
        const data = await res.json();
        setActiveDeliveries(data.map((item: any) => ({
          id: item._id,
          orderId: item.orderId || "",
          restaurantName: item.restaurantName || "",
          customerName: item.customerName || "",
          customerAddress: item.deliveryAddress || "",
          deliveryStatus: item.deliveryStatus || "pending",
          assignedTo: item.assignedTo,
          pickupTime: item.pickupTime || "",
          deliveryTime: item.deliveryTime || "",
          createdAt: item.createdAt || "",
          updatedAt: item.updatedAt || "",
        })));
      } catch (e) {
        setActiveDeliveries([]);
      }
      setIsLoading(false);
    }
    fetchDeliveries();
  }, []);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "inactive": return "bg-gray-500"
      case "on_delivery": return "bg-blue-500"
      case "pending": return "bg-yellow-500"
      case "assigned": return "bg-purple-500"
      case "picked_up": return "bg-indigo-500"
      case "in_transit": return "bg-blue-500"
      case "delivered": return "bg-green-500"
      case "failed": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike": return <Bike className="h-4 w-4" />
      case "scooter": return <Bike className="h-4 w-4" />
      case "car": return <Car className="h-4 w-4" />
      default: return <Truck className="h-4 w-4" />
    }
  }

  const filteredDeliveryPersonnel = deliveryPersonnel.filter((person) => {
    if (deliveryPersonnelFilter !== "all" && person.status !== deliveryPersonnelFilter) {
      return false
    }
    if (searchQuery) {
      return (
        person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.phone?.includes(searchQuery)
      )
    }
    return true
  })

  const filteredDeliveries = activeDeliveries.filter((delivery) => {
    if (deliveriesFilter !== "all" && delivery.deliveryStatus !== deliveriesFilter) {
      return false
    }
    if (searchQuery) {
      return (
        delivery.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.id?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="grid gap-6 md:grid-cols-2">
          {Array(2)
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
          Manage delivery personnel and track active deliveries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
              {activeDeliveries.filter((d) => d.deliveryStatus === "pending").length} pending,{" "}
              {activeDeliveries.filter((d) => ["assigned", "picked_up", "in_transit"].includes(d.deliveryStatus)).length} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personnel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personnel">Delivery Personnel</TabsTrigger>
          <TabsTrigger value="deliveries">Active Deliveries</TabsTrigger>
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
                            <AvatarImage src={person.avatar || "/placeholder.svg?height=32&width=32"} alt={person.name || "?"} />
                            <AvatarFallback>{person?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{person.name || "Unnamed"}</div>
                            <div className="text-xs text-muted-foreground">{person.email || "No email"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{person.phone || "-"}</span>
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
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => {
                    const assignedPerson = deliveryPersonnel.find(p => p.id === delivery.assignedTo)
                    return (
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
                          {assignedPerson ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback>{assignedPerson?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                              </Avatar>
                              <span>{assignedPerson.name || "Unnamed"}</span>
                            </div>
                          ) : (
                            <Badge variant="outline">Unassigned</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(delivery.deliveryStatus)} text-white`}>
                            {delivery.deliveryStatus.charAt(0).toUpperCase() + delivery.deliveryStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {delivery.pickupTime ? new Date(delivery.pickupTime).toLocaleTimeString() : "-"}
                        </TableCell>
                        <TableCell>
                          {delivery.deliveryTime ? new Date(delivery.deliveryTime).toLocaleTimeString() : "-"}
                        </TableCell>
                        <TableCell>
                          {delivery.createdAt ? new Date(delivery.createdAt).toLocaleTimeString() : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            {delivery.deliveryStatus === "pending" && (
                              <Button size="sm">Assign</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
                View and manage details for {selectedDeliveryPerson.name || "Unnamed"}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedDeliveryPerson.avatar || "/placeholder.svg?height=64&width=64"}
                    alt={selectedDeliveryPerson.name || "?"}
                  />
                  <AvatarFallback>{selectedDeliveryPerson?.name?.charAt(0)?.toUpperCase() || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDeliveryPerson.name || "Unnamed"}</h3>
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
                      <span>{selectedDeliveryPerson.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedDeliveryPerson.phone || "-"}</span>
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
                      <span>
                        Vehicle: {selectedDeliveryPerson.vehicleType?.charAt(0).toUpperCase() + selectedDeliveryPerson.vehicleType?.slice(1)}
                      </span>
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

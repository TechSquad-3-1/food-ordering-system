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
  address: string
  createdAt: any
  vehicleNumber: string
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
  // ======================== EXISTING STATE ========================
  const [isLoading, setIsLoading] = useState(true)
  const [deliveryPersonnel, setDeliveryPersonnel] = useState<DeliveryPerson[]>([])
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([])
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<DeliveryPerson | null>(null)
  const [deliveryPersonnelFilter, setDeliveryPersonnelFilter] = useState("all")
  const [deliveriesFilter, setDeliveriesFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicleNumber: "",
    status: "inactive" as "active" | "inactive" | "on_delivery",
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")

  // ...existing useEffect hooks and other logic remain unchanged...

  // ======================== EDIT HANDLERS ========================
  const openEdit = (person: DeliveryPerson) => {
    setEditForm({
      name: person.name || "",
      email: person.email || "",
      phone: person.phone || "",
      address: person.address || "",
      vehicleNumber: person.vehicleNumber || "",
      status: person.status,
    })
    setIsEditing(true)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "status" 
        ? value as "active" | "inactive" | "on_delivery" 
        : value,
    }))
  }

  const handleEditSubmit = async () => {
    if (!selectedDeliveryPerson) return
    setEditLoading(true)
    setEditError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `http://localhost:4000/api/auth/update/${selectedDeliveryPerson.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      )
      if (!res.ok) throw new Error("Failed to update user")
      
      // Update local state
      setSelectedDeliveryPerson((prev) =>
        prev ? { ...prev, ...editForm } : prev
      )
      setDeliveryPersonnel((prev) =>
        prev.map((p) =>
          p.id === selectedDeliveryPerson.id ? { ...p, ...editForm } : p
        )
      )
      setIsEditing(false)
    } catch (e) {
      setEditError("Update failed. Please try again.")
    } finally {
      setEditLoading(false)
    }
  }

  // Fetch delivery personnel from backend (UPDATED TO MATCH NEW DATA FORMAT)
  useEffect(() => {
    async function fetchDeliveryPersonnel() {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:4000/api/auth/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch users")
        const users = await res.json()
        // Only include users with role "delivery_man"
        const deliveryPersons = users.filter(
          (user: any) => user.role === "delivery_man"
        )
        setDeliveryPersonnel(
          deliveryPersons.map((item: any) => ({
            id: item._id,
            name: item.name || "",
            email: item.email || "",
            phone: item.phone || "",
            status: item.status || "inactive",
            rating: item.rating ?? 4.5,
            totalDeliveries: item.totalDeliveries ?? 0,
            vehicleType: item.vehicleNumber ? "bike" : "bike", // Default to "bike" if not specified
            vehicleNumber: item.vehicleNumber || "",
            address: item.address || "",
            restaurantName: item.restaurantName || "",
            createdAt: item.createdAt || "",
            location: item.location,
            avatar: item.avatar,
          }))
        )
      } catch (e) {
        setDeliveryPersonnel([])
      } finally {
        setIsLoading(false)
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

  function setShowAddDeliveryPersonDialog(arg0: boolean): void {
    throw new Error("Function not implemented.")
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
      <TableHead>Vehicle No</TableHead>
      <TableHead>Address</TableHead>
      <TableHead>Joined</TableHead>
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
          {person.vehicleNumber || "-"}
        </TableCell>
        <TableCell>
          {person.address || "-"}
        </TableCell>
        <TableCell>
          {person.createdAt ? new Date(person.createdAt).toLocaleDateString() : "-"}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedDeliveryPerson(person)}>
              View Details
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
                          {/* View Details button removed as requested */}
                          <div className="flex items-center gap-2">
                            {/* Other action buttons can go here if needed */}
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

     

      {/* Delivery Person Details Dialog */}
      {selectedDeliveryPerson && (
  <Dialog open={!!selectedDeliveryPerson} onOpenChange={() => { setSelectedDeliveryPerson(null); setIsEditing(false); }}>
    <DialogContent className="sm:max-w-[500px] rounded-xl shadow-xl border-0 p-0">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-xl px-6 py-5 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
          <AvatarImage
            src={selectedDeliveryPerson.avatar || "/placeholder.svg?height=64&width=64"}
            alt={selectedDeliveryPerson.name || "?"}
          />
          <AvatarFallback>
            {selectedDeliveryPerson?.name?.charAt(0)?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {selectedDeliveryPerson.name || "Unnamed"}
          </h2>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(selectedDeliveryPerson.status)} text-white text-xs px-2 py-0.5 rounded`}>
              {selectedDeliveryPerson.status === "active"
                ? "Active"
                : selectedDeliveryPerson.status === "inactive"
                ? "Inactive"
                : "On Delivery"}
            </Badge>
            <span className="text-xs text-blue-100">
              ID: {selectedDeliveryPerson.id}
            </span>
          </div>
        </div>
      </div>
      <div className="px-6 py-6 bg-white rounded-b-xl">
        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Contact</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>{selectedDeliveryPerson.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span>{selectedDeliveryPerson.phone || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span>{selectedDeliveryPerson.address || "-"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Delivery Info</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span>Vehicle No: {selectedDeliveryPerson.vehicleNumber || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>
                      Joined: {selectedDeliveryPerson.createdAt
                        ? new Date(selectedDeliveryPerson.createdAt).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVehicleIcon(selectedDeliveryPerson.vehicleType)}
                    <span>Vehicle Type: {selectedDeliveryPerson.vehicleType}</span>
                  </div>
                  {selectedDeliveryPerson.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>
                        Location: {selectedDeliveryPerson.location.lat}, {selectedDeliveryPerson.location.lng}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openEdit(selectedDeliveryPerson)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="outline" onClick={() => setSelectedDeliveryPerson(null)}>
                Close
              </Button>
            </div>
          </>
        ) : (
          // ... keep your existing edit form code here, unchanged ...
          <form
            onSubmit={e => {
              e.preventDefault()
              handleEditSubmit()
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-4">
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
      <Input
        name="name"
        value={editForm.name}
        onChange={handleEditChange}
        required
      />
    </div>
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
      <Input
        name="email"
        type="email"
        value={editForm.email}
        onChange={handleEditChange}
        required
      />
    </div>
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Phone</Label>
      <Input
        name="phone"
        value={editForm.phone}
        onChange={handleEditChange}
        required
      />
    </div>
  </div>
  <div className="space-y-4">
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Address</Label>
      <Input
        name="address"
        value={editForm.address}
        onChange={handleEditChange}
      />
    </div>
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</Label>
      <Input
        name="vehicleNumber"
        value={editForm.vehicleNumber}
        onChange={handleEditChange}
      />
    </div>
    <div>
      <Label className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
      <select
        name="status"
        value={editForm.status}
        onChange={handleEditChange}
        className="w-full border rounded px-2 py-1"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="on_delivery">On Delivery</option>
      </select>
    </div>
  </div>
</div>
{editError && <div className="text-red-500 text-sm">{editError}</div>}
<div className="flex justify-end gap-2">
  <Button
    variant="outline"
    type="button"
    onClick={() => setIsEditing(false)}
    disabled={editLoading}
  >
    Cancel
  </Button>
  <Button type="submit" disabled={editLoading}>
    {editLoading ? "Saving..." : "Save"}
  </Button>
</div>

          </form>
        )}
      </div>
    </DialogContent>
  </Dialog>
)}


    </div>
  )
}

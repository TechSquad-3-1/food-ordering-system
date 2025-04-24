"use client"

import { useState, useEffect, SetStateAction } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Save,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface OwnerInfo {
  name: string
  email: string
  phone: string
  address: string
  restaurantName: string
}

const RESTAURANT_SCHEMA = {
  name: "",
  image: "",
  rating: 0,
  deliveryTime: "",
  deliveryFee: "",
  minOrder: "",
  distance: "",
  cuisines: [],
  priceLevel: 1,
  is_active: true,
  location: {
    type: "Point",
    coordinates: [0, 0],
    tag: ""
  },
  open_time: "",
  closed_time: ""
}

export default function RestaurantSettings() {
  // Owner state and logic
  const [owner, setOwner] = useState<OwnerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    restaurantName: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [password, setPassword] = useState("")
  const [ownerId, setOwnerId] = useState<string | null>(null)

  useEffect(() => {
    const storedId = localStorage.getItem("restaurantOwnerId")
    if (!storedId) {
      console.error("Owner ID not found in localStorage")
      return
    }
    setOwnerId(storedId)

    const fetchOwner = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`http://localhost:4000/api/auth/restaurant-owner/${storedId}`)
        if (!res.ok) throw new Error("Failed to fetch owner data")
        const data = await res.json()
        setOwner({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          restaurantName: data.restaurantName || "",
        })
        localStorage.setItem("owner", JSON.stringify(data))
      } catch (error) {
        console.error("Error fetching owner data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOwner()
  }, [])

  const handleSaveOwner = async () => {
    const storedId = localStorage.getItem("restaurantOwnerId")
    if (!storedId) {
      alert("Owner ID not found in localStorage.")
      return
    }
    if (!password) {
      alert("Please enter your password to save changes.")
      return
    }
    try {
      const response = await fetch(`http://localhost:4000/api/auth/update/${storedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...owner, password }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }
      alert("Owner info updated successfully!")
      setIsEditing(false)
      setPassword("")
      localStorage.setItem("owner", JSON.stringify(owner))
    } catch (error) {
      console.error("Error updating owner info:", error)
      alert("Error updating owner info.")
    }
  }

  // Restaurant state and logic
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)
  const [restaurantForm, setRestaurantForm] = useState<any>(RESTAURANT_SCHEMA)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/restaurants")
      const data = await response.json()
      setRestaurants(data)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    }
  }

  // Handle add or update restaurant
  const handleAddOrUpdateRestaurant = async () => {
    try {
      const method = selectedRestaurant ? "PUT" : "POST"
      const url = selectedRestaurant
        ? `http://localhost:3001/api/restaurants/${selectedRestaurant._id}`
        : "http://localhost:3001/api/restaurants"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantForm),
      })

      if (response.ok) {
        setIsAddRestaurantOpen(false)
        setRestaurantForm(RESTAURANT_SCHEMA)
        setSelectedRestaurant(null)
        fetchRestaurants()
      } else {
        console.error("Failed to save restaurant")
      }
    } catch (error) {
      console.error("Error saving restaurant:", error)
    }
  }

  // Handle delete restaurant
  const handleDeleteRestaurant = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/restaurants/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchRestaurants()
      } else {
        console.error("Failed to delete restaurant")
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error)
    }
  }

  // Handle open dialog for add/edit
  const openAddEditDialog = (restaurant?: any) => {
    if (restaurant) {
      setSelectedRestaurant(restaurant)
      setRestaurantForm({ ...restaurant })
    } else {
      setSelectedRestaurant(null)
      setRestaurantForm(RESTAURANT_SCHEMA)
    }
    setIsAddRestaurantOpen(true)
  }

  // Handle input changes in restaurant form
  const handleRestaurantInput = (field: string, value: any) => {
    setRestaurantForm((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle location input changes
  const handleLocationInput = (field: string, value: any) => {
    setRestaurantForm((prev: any) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }))
  }

  // Save restaurant ID to localStorage after add/update
  useEffect(() => {
    if (restaurants.length > 0) {
      // Assume the first restaurant belongs to the owner (customize as needed)
      localStorage.setItem("restaurantId", restaurants[0]._id)
    }
  }, [restaurants])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Settings</h1>
        <p className="text-muted-foreground">
          Manage your restaurant profile and owner information.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="owner-profile">Owner Profile</TabsTrigger>
        </TabsList>

        {/* Restaurant Profile Tab */}
        <TabsContent value="profile" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Profile</CardTitle>
              <CardDescription>
                Update your restaurant information visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={() => openAddEditDialog()}>Add New Restaurant</Button>
              <Separator />
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div key={restaurant._id} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.location?.tag}</p>
                      <Badge>{restaurant.is_active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => openAddEditDialog(restaurant)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRestaurant(restaurant._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Owner Profile Tab */}
        <TabsContent value="owner-profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner Profile</CardTitle>
              <CardDescription>Manage owner information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div>Loading owner info...</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Owner Name</Label>
                    <Input
                      id="owner-name"
                      value={owner.name}
                      onChange={(e: { target: { value: any } }) => setOwner({ ...owner, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Owner Email</Label>
                    <Input
                      id="owner-email"
                      value={owner.email}
                      onChange={(e: { target: { value: any } }) => setOwner({ ...owner, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone">Owner Phone</Label>
                    <Input
                      id="owner-phone"
                      value={owner.phone}
                      onChange={(e: { target: { value: any } }) => setOwner({ ...owner, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-address">Owner Address</Label>
                    <Input
                      id="owner-address"
                      value={owner.address}
                      onChange={(e: { target: { value: any } }) => setOwner({ ...owner, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-restaurant">Restaurant Name</Label>
                    <Input
                      id="owner-restaurant"
                      value={owner.restaurantName}
                      onChange={(e: { target: { value: any } }) => setOwner({ ...owner, restaurantName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="owner-password">Confirm Password</Label>
                      <Input
                        id="owner-password"
                        type="password"
                        value={password}
                        onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              {isEditing ? (
                <Button onClick={handleSaveOwner}>Save Changes</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Restaurant Dialog */}
      <Dialog open={isAddRestaurantOpen} onOpenChange={setIsAddRestaurantOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedRestaurant ? "Edit Restaurant" : "Add New Restaurant"}</DialogTitle>
            <DialogDescription>
              {selectedRestaurant ? "Update your restaurant details" : "Add a new restaurant"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div className="space-y-2">
                <Label htmlFor="restaurant-name-dialog">Restaurant Name</Label>
                <Input
                  id="restaurant-name-dialog"
                  value={restaurantForm.name}
                  onChange={(e: { target: { value: any } }) => handleRestaurantInput("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-image">Image URL</Label>
                <Input
                  id="restaurant-image"
                  value={restaurantForm.image}
                  onChange={(e: { target: { value: any } }) => handleRestaurantInput("image", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-rating">Rating</Label>
                  <Input
                    id="restaurant-rating"
                    type="number"
                    value={restaurantForm.rating}
                    onChange={(e: { target: { value: string } }) => handleRestaurantInput("rating", parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-deliveryTime">Delivery Time</Label>
                  <Input
                    id="restaurant-deliveryTime"
                    value={restaurantForm.deliveryTime}
                    onChange={(e: { target: { value: any } }) => handleRestaurantInput("deliveryTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-deliveryFee">Delivery Fee</Label>
                  <Input
                    id="restaurant-deliveryFee"
                    value={restaurantForm.deliveryFee}
                    onChange={(e: { target: { value: any } }) => handleRestaurantInput("deliveryFee", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-minOrder">Minimum Order</Label>
                  <Input
                    id="restaurant-minOrder"
                    value={restaurantForm.minOrder}
                    onChange={(e: { target: { value: any } }) => handleRestaurantInput("minOrder", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-distance">Distance</Label>
                  <Input
                    id="restaurant-distance"
                    value={restaurantForm.distance}
                    onChange={(e: { target: { value: any } }) => handleRestaurantInput("distance", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-priceLevel">Price Level</Label>
                  <Input
                    id="restaurant-priceLevel"
                    type="number"
                    value={restaurantForm.priceLevel}
                    onChange={(e: { target: { value: string } }) => handleRestaurantInput("priceLevel", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-cuisines">Cuisines (comma separated)</Label>
                <Input
                  id="restaurant-cuisines"
                  value={restaurantForm.cuisines.join(", ")}
                  onChange={(e: { target: { value: string } }) => handleRestaurantInput("cuisines", e.target.value.split(",").map((v: string) => v.trim()))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-location-tag">Location Tag</Label>
                <Input
                  id="restaurant-location-tag"
                  value={restaurantForm.location.tag}
                  onChange={(e: { target: { value: any } }) => handleLocationInput("tag", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-location-lng">Longitude</Label>
                  <Input
                    id="restaurant-location-lng"
                    type="number"
                    value={restaurantForm.location.coordinates[0]}
                    onChange={(e: { target: { value: string } }) => handleLocationInput("coordinates", [parseFloat(e.target.value), restaurantForm.location.coordinates[1]])}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-location-lat">Latitude</Label>
                  <Input
                    id="restaurant-location-lat"
                    type="number"
                    value={restaurantForm.location.coordinates[1]}
                    onChange={(e: { target: { value: string } }) => handleLocationInput("coordinates", [restaurantForm.location.coordinates[0], parseFloat(e.target.value)])}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-open-time">Open Time</Label>
                <Input
                  id="restaurant-open-time"
                  value={restaurantForm.open_time}
                  onChange={(e: { target: { value: any } }) => handleRestaurantInput("open_time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-closed-time">Closed Time</Label>
                <Input
                  id="restaurant-closed-time"
                  value={restaurantForm.closed_time}
                  onChange={(e: { target: { value: any } }) => handleRestaurantInput("closed_time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-active">Active</Label>
                <Switch
                  id="restaurant-active"
                  checked={restaurantForm.is_active}
                  onCheckedChange={(checked: any) => handleRestaurantInput("is_active", checked)}
                />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRestaurantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateRestaurant}>
              {selectedRestaurant ? "Update Restaurant" : "Add Restaurant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

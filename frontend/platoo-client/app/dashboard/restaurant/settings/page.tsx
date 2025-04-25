"use client"

import { useState, useEffect } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  closed_time: "",
  owner_id: ""
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
    if (!ownerId) {
      alert("Owner ID not found in localStorage.")
      return
    }
    if (!password) {
      alert("Please enter your password to save changes.")
      return
    }
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      alert("You are not authenticated.")
      return
    }
    try {
      const response = await fetch(`http://localhost:4000/api/auth/update/${ownerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
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
  
  // Delete owner handler
  const handleDeleteOwner = async () => {
    if (!ownerId) {
      alert("Owner ID not found in localStorage.")
      return
    }
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      alert("You are not authenticated.")
      return
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    )
    if (!confirmDelete) return
  
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/delete/${ownerId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      )
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete account")
      }
  
      // Clear local storage and redirect
      localStorage.removeItem("restaurantOwnerId")
      localStorage.removeItem("owner")
      localStorage.removeItem("restaurantId")
      localStorage.removeItem("jwtToken")
      window.location.href = "/login"
    } catch (error) {
      console.error("Error deleting owner account:", error)
      alert("Error deleting account. Please try again.")
    }
  }
  
  // Restaurant state and logic
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([])
  const [restaurantForm, setRestaurantForm] = useState<any>(RESTAURANT_SCHEMA)
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (ownerId) {
      setFilteredRestaurants(
        restaurants.filter((r) => r.owner_id === ownerId)
      )
    }
  }, [restaurants, ownerId])

  // Automatically open edit dialog for first restaurant if not already open
  useEffect(() => {
    if (
      filteredRestaurants.length > 0 &&
      !isAddRestaurantOpen &&
      !selectedRestaurant
    ) {
      setSelectedRestaurant(filteredRestaurants[0])
      setRestaurantForm({ ...filteredRestaurants[0] })
      setIsAddRestaurantOpen(true)
    }
  }, [filteredRestaurants])

  const fetchRestaurants = async () => {
    setIsRestaurantLoading(true)
    try {
      const response = await fetch("http://localhost:3001/api/restaurants")
      const data = await response.json()
      setRestaurants(data)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    }
    setIsRestaurantLoading(false)
  }

  const openAddEditDialog = (restaurant?: any) => {
    setSelectedRestaurant(restaurant || null)
    setRestaurantForm(restaurant ? { ...restaurant } : RESTAURANT_SCHEMA)
    setIsAddRestaurantOpen(true)
  }

  const handleAddOrUpdateRestaurant = async () => {
    try {
      const url = selectedRestaurant
        ? `http://localhost:3001/api/restaurants/${selectedRestaurant._id}`
        : "http://localhost:3001/api/restaurants"

      const method = selectedRestaurant ? "PUT" : "POST"
      const restaurantData = {
        ...restaurantForm,
        owner_id: ownerId,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      })

      if (response.ok) {
        alert(`Restaurant ${selectedRestaurant ? "updated" : "added"} successfully!`)
        fetchRestaurants()
        setIsAddRestaurantOpen(false)
        setSelectedRestaurant(null)
      }
    } catch (error) {
      console.error("Error saving restaurant:", error)
    }
  }

  const handleDeleteRestaurant = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this restaurant?")
    if (!confirmDelete) return

    try {
      const response = await fetch(`http://localhost:3001/api/restaurants/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        alert("Restaurant deleted successfully!")
        fetchRestaurants()
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error)
    }
  }

  const handleRestaurantInput = (field: string, value: any) => {
    setRestaurantForm((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLocationInput = (field: string, value: any) => {
    setRestaurantForm((prev: any) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
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
                {filteredRestaurants.map((restaurant) => (
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
                {filteredRestaurants.length === 0 && (
                  <div className="text-muted-foreground">No restaurants found for this owner.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Owner Profile Tab */}
        <TabsContent value="owner-profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner Profile</CardTitle>
              <CardDescription>
                Manage your account information
                {owner.restaurantName && ` - ${owner.restaurantName}`}
              </CardDescription>
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
                      onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-email">Owner Email</Label>
                    <Input
                      id="owner-email"
                      value={owner.email}
                      onChange={(e) => setOwner({ ...owner, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-phone">Owner Phone</Label>
                    <Input
                      id="owner-phone"
                      value={owner.phone}
                      onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-address">Owner Address</Label>
                    <Input
                      id="owner-address"
                      value={owner.address}
                      onChange={(e) => setOwner({ ...owner, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-restaurant">Restaurant Name</Label>
                    <Input
                      id="owner-restaurant"
                      value={owner.restaurantName}
                      onChange={(e) => setOwner({ ...owner, restaurantName: e.target.value })}
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
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-4">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveOwner}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteOwner}
                  >
                    Delete Account
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </>
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
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAddOrUpdateRestaurant()
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input
                  id="restaurant-name"
                  value={restaurantForm.name}
                  onChange={(e) => handleRestaurantInput("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-image">Image URL</Label>
                <Input
                  id="restaurant-image"
                  value={restaurantForm.image}
                  onChange={(e) => handleRestaurantInput("image", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-rating">Rating</Label>
                  <Input
                    id="restaurant-rating"
                    type="number"
                    value={restaurantForm.rating}
                    onChange={(e) => handleRestaurantInput("rating", parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-deliveryTime">Delivery Time</Label>
                  <Input
                    id="restaurant-deliveryTime"
                    value={restaurantForm.deliveryTime}
                    onChange={(e) => handleRestaurantInput("deliveryTime", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-deliveryFee">Delivery Fee</Label>
                  <Input
                    id="restaurant-deliveryFee"
                    value={restaurantForm.deliveryFee}
                    onChange={(e) => handleRestaurantInput("deliveryFee", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-minOrder">Minimum Order</Label>
                  <Input
                    id="restaurant-minOrder"
                    value={restaurantForm.minOrder}
                    onChange={(e) => handleRestaurantInput("minOrder", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-distance">Distance</Label>
                  <Input
                    id="restaurant-distance"
                    value={restaurantForm.distance}
                    onChange={(e) => handleRestaurantInput("distance", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-priceLevel">Price Level</Label>
                  <Input
                    id="restaurant-priceLevel"
                    type="number"
                    value={restaurantForm.priceLevel}
                    onChange={(e) => handleRestaurantInput("priceLevel", parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-cuisines">Cuisines (comma separated)</Label>
                <Input
                  id="restaurant-cuisines"
                  value={restaurantForm.cuisines.join(", ")}
                  onChange={(e) =>
                    handleRestaurantInput(
                      "cuisines",
                      e.target.value.split(",").map((v: string) => v.trim())
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-location-tag">Location Tag</Label>
                <Input
                  id="restaurant-location-tag"
                  value={restaurantForm.location.tag}
                  onChange={(e) => handleLocationInput("tag", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-location-lng">Longitude</Label>
                  <Input
                    id="restaurant-location-lng"
                    type="number"
                    value={restaurantForm.location.coordinates[0]}
                    onChange={(e) =>
                      handleLocationInput("coordinates", [
                        parseFloat(e.target.value),
                        restaurantForm.location.coordinates[1],
                      ])
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-location-lat">Latitude</Label>
                  <Input
                    id="restaurant-location-lat"
                    type="number"
                    value={restaurantForm.location.coordinates[1]}
                    onChange={(e) =>
                      handleLocationInput("coordinates", [
                        restaurantForm.location.coordinates[0],
                        parseFloat(e.target.value),
                      ])
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-open-time">Open Time</Label>
                <Input
                  id="restaurant-open-time"
                  value={restaurantForm.open_time}
                  onChange={(e) => handleRestaurantInput("open_time", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-closed-time">Closed Time</Label>
                <Input
                  id="restaurant-closed-time"
                  value={restaurantForm.closed_time}
                  onChange={(e) => handleRestaurantInput("closed_time", e.target.value)}
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
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddRestaurantOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedRestaurant ? "Update Restaurant" : "Add Restaurant"}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

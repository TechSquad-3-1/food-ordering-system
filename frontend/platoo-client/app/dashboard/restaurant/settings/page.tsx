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
  CreditCard,
  Bell,
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

export default function RestaurantSettings() {
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)

  // Fetch restaurants from backend on component mount
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

  const handleAddOrUpdateRestaurant = async (formData: any) => {
    try {
      const method = selectedRestaurant ? "PUT" : "POST"
      const url = selectedRestaurant
        ? `http://localhost:3001/api/restaurants/${selectedRestaurant.id}`
        : "http://localhost:3001/api/restaurants"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsAddRestaurantOpen(false)
        fetchRestaurants() // Refresh restaurants after adding/updating
      } else {
        console.error("Failed to save restaurant")
      }
    } catch (error) {
      console.error("Error saving restaurant:", error)
    }
  }

  const handleDeleteRestaurant = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/restaurants/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchRestaurants() // Refresh restaurants after deletion
      } else {
        console.error("Failed to delete restaurant")
      }
    } catch (error) {
      console.error("Error deleting restaurant:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Settings</h1>
        <p className="text-muted-foreground">
          Manage your restaurant profile, business hours, and account settings.
        </p>
      </div>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Profile</CardTitle>
              <CardDescription>
                Update your restaurant information visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:items-start sm:justify-start sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Restaurant Logo" />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Restaurant Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your profile and in search results.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Logo
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input id="restaurant-name" defaultValue="Platoo Restaurant" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine-type">Cuisine Type</Label>
                  <Select defaultValue="indian">
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Authentic Indian cuisine with a modern twist. We specialize in flavorful biryanis, rich curries, and freshly baked bread from our tandoor oven."
                  rows={4}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <Phone className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                    <Input id="email" defaultValue="contact@platoorestaurant.com" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                  <Globe className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                  <Input id="website" defaultValue="https://platoorestaurant.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Restaurant Address</Label>
                <div className="flex">
                  <MapPin className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                  <Input id="address" defaultValue="123 Food Street, Culinary District, NY 10001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Restaurant Features</Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="dine-in" defaultChecked />
                    <Label htmlFor="dine-in">Dine-in</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="takeout" defaultChecked />
                    <Label htmlFor="takeout">Takeout</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery" defaultChecked />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="vegetarian" defaultChecked />
                    <Label htmlFor="vegetarian">Vegetarian Options</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="vegan" />
                    <Label htmlFor="vegan">Vegan Options</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="gluten-free" />
                    <Label htmlFor="gluten-free">Gluten-Free Options</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsAddRestaurantOpen(true)}>
                <Save className="mr-2 h-4 w-4" />
                Add/Edit Restaurant
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Restaurant List</CardTitle>
              <CardDescription>View and manage all your restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div key={restaurant.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedRestaurant(restaurant)
                          setIsAddRestaurantOpen(true)
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteRestaurant(restaurant.id)}
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
                <Label htmlFor="restaurant-name">Restaurant Name</Label>
                <Input id="restaurant-name" defaultValue={selectedRestaurant?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-description">Description</Label>
                <Textarea
                  id="restaurant-description"
                  defaultValue={selectedRestaurant?.description || ""}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-phone">Phone Number</Label>
                  <Input id="restaurant-phone" defaultValue={selectedRestaurant?.phone || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-email">Email Address</Label>
                  <Input id="restaurant-email" defaultValue={selectedRestaurant?.email || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-address">Address</Label>
                <Input id="restaurant-address" defaultValue={selectedRestaurant?.address || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restaurant-cuisines">Cuisines</Label>
                <Input id="restaurant-cuisines" defaultValue={selectedRestaurant?.cuisines?.join(", ") || ""} />
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRestaurantOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const formData = {
                  name: (document.getElementById("restaurant-name") as HTMLInputElement)?.value,
                  description: (document.getElementById("restaurant-description") as HTMLTextAreaElement)?.value,
                  phone: (document.getElementById("restaurant-phone") as HTMLInputElement)?.value,
                  email: (document.getElementById("restaurant-email") as HTMLInputElement)?.value,
                  address: (document.getElementById("restaurant-address") as HTMLInputElement)?.value,
                  cuisines: (document.getElementById("restaurant-cuisines") as HTMLInputElement)?.value.split(", "),
                  is_active: true,
                }
                handleAddOrUpdateRestaurant(formData)
              }}
            >
              {selectedRestaurant ? "Update Restaurant" : "Add Restaurant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
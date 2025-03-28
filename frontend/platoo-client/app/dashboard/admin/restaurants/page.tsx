"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Store,
  Star,
} from "lucide-react"

interface Restaurant {
  id: string
  name: string
  owner: {
    id: string
    name: string
    email: string
  }
  address: string
  cuisine: string[]
  rating: number
  reviewCount: number
  status: string
  joinDate: string
  orders: number
  revenue: number
  image?: string
}

export default function RestaurantsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  useEffect(() => {
    // In a real app, fetch restaurants from API
    // For demo purposes, we'll use mock data
    const fetchRestaurants = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockRestaurants: Restaurant[] = [
          {
            id: "RES-1001",
            name: "Burger Palace",
            owner: {
              id: "USR-1002",
              name: "Mike Chen",
              email: "mike.c@example.com",
            },
            address: "123 Main St, Washington, DC",
            cuisine: ["American", "Fast Food", "Burgers"],
            rating: 4.7,
            reviewCount: 253,
            status: "active",
            joinDate: "2023-01-15",
            orders: 1245,
            revenue: 18675.5,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1002",
            name: "Pizza Heaven",
            owner: {
              id: "USR-1007",
              name: "Angela Martinez",
              email: "angela.m@example.com",
            },
            address: "456 Oak St, Washington, DC",
            cuisine: ["Italian", "Pizza"],
            rating: 4.5,
            reviewCount: 187,
            status: "active",
            joinDate: "2023-02-10",
            orders: 987,
            revenue: 14560.75,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1003",
            name: "Sushi Express",
            owner: {
              id: "USR-1012",
              name: "Takashi Yamamoto",
              email: "takashi.y@example.com",
            },
            address: "789 Pine St, Washington, DC",
            cuisine: ["Japanese", "Sushi", "Asian"],
            rating: 4.8,
            reviewCount: 142,
            status: "active",
            joinDate: "2023-03-05",
            orders: 756,
            revenue: 12890.25,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1004",
            name: "Taco Time",
            owner: {
              id: "USR-1018",
              name: "Carlos Rodriguez",
              email: "carlos.r@example.com",
            },
            address: "321 Elm St, Washington, DC",
            cuisine: ["Mexican", "Tacos"],
            rating: 4.2,
            reviewCount: 98,
            status: "active",
            joinDate: "2023-03-20",
            orders: 543,
            revenue: 8765.5,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1005",
            name: "Green Bowl",
            owner: {
              id: "USR-1023",
              name: "Sarah Green",
              email: "sarah.g@example.com",
            },
            address: "567 Maple St, Washington, DC",
            cuisine: ["Healthy", "Salads", "Bowls"],
            rating: 4.6,
            reviewCount: 76,
            status: "active",
            joinDate: "2023-04-01",
            orders: 432,
            revenue: 6543.75,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1006",
            name: "Pasta Place",
            owner: {
              id: "USR-1029",
              name: "Sophia Romano",
              email: "sophia.r@example.com",
            },
            address: "890 Cedar St, Washington, DC",
            cuisine: ["Italian", "Pasta"],
            rating: 4.4,
            reviewCount: 112,
            status: "suspended",
            joinDate: "2023-02-15",
            orders: 654,
            revenue: 9876.25,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1007",
            name: "Spice of India",
            owner: {
              id: "USR-1035",
              name: "Raj Patel",
              email: "raj.p@example.com",
            },
            address: "432 Birch St, Washington, DC",
            cuisine: ["Indian", "Curry", "Spicy"],
            rating: 4.6,
            reviewCount: 89,
            status: "active",
            joinDate: "2023-03-10",
            orders: 521,
            revenue: 7654.5,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1008",
            name: "Thai Delight",
            owner: {
              id: "USR-1041",
              name: "Suki Thani",
              email: "suki.t@example.com",
            },
            address: "765 Walnut St, Washington, DC",
            cuisine: ["Thai", "Asian", "Spicy"],
            rating: 4.5,
            reviewCount: 67,
            status: "pending_review",
            joinDate: "2023-04-05",
            orders: 0,
            revenue: 0,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1009",
            name: "Mediterranean Grill",
            owner: {
              id: "USR-1047",
              name: "Elias Stavros",
              email: "elias.s@example.com",
            },
            address: "234 Olive St, Washington, DC",
            cuisine: ["Mediterranean", "Greek", "Healthy"],
            rating: 4.7,
            reviewCount: 54,
            status: "pending_documents",
            joinDate: "2023-04-10",
            orders: 0,
            revenue: 0,
            image: "/placeholder.svg?height=40&width=40",
          },
          {
            id: "RES-1010",
            name: "Fast Bites",
            owner: {
              id: "USR-1053",
              name: "Tom Jackson",
              email: "tom.j@example.com",
            },
            address: "876 Cherry St, Washington, DC",
            cuisine: ["Fast Food", "Burgers", "Chicken"],
            rating: 4.1,
            reviewCount: 123,
            status: "inactive",
            joinDate: "2023-01-20",
            orders: 345,
            revenue: 4567.25,
            image: "/placeholder.svg?height=40&width=40",
          },
        ]

        setRestaurants(mockRestaurants)
        setFilteredRestaurants(mockRestaurants)
      } catch (error) {
        console.error("Error fetching restaurants:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  useEffect(() => {
    // Apply filters whenever filter criteria change
    applyFilters()
  }, [searchQuery, cuisineFilter, statusFilter, restaurants])

  const applyFilters = () => {
    let filtered = [...restaurants]

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.owner.name.toLowerCase().includes(query) ||
          restaurant.id.toLowerCase().includes(query),
      )
    }

    // Apply cuisine filter
    if (cuisineFilter !== "all") {
      filtered = filtered.filter((restaurant) =>
        restaurant.cuisine.some((cuisine) => cuisine.toLowerCase() === cuisineFilter.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.status === statusFilter)
    }

    setFilteredRestaurants(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleDeleteRestaurant = () => {
    if (!selectedRestaurant) return

    // In a real app, this would send a delete request to the backend
    setRestaurants((prev) => prev.filter((restaurant) => restaurant.id !== selectedRestaurant.id))

    // Close dialog and reset selected restaurant
    setIsDeleteDialogOpen(false)
    setSelectedRestaurant(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-500"
      case "suspended":
        return "bg-red-500"
      case "pending_review":
      case "pending_documents":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case "pending_review":
        return "Pending Review"
      case "pending_documents":
        return "Pending Documents"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const cuisineTypes = [
    "All",
    "American",
    "Italian",
    "Japanese",
    "Mexican",
    "Indian",
    "Thai",
    "Mediterranean",
    "Fast Food",
    "Healthy",
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Management</h1>
        <p className="text-muted-foreground">Manage all restaurants on your platform</p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Restaurants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/admin/restaurants/add")}>
              <Store className="mr-2 h-4 w-4" />
              Add Restaurant
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
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
                    placeholder="Search restaurants..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cuisines</SelectItem>
                    {cuisineTypes.map((cuisine) => (
                      <SelectItem key={cuisine.toLowerCase()} value={cuisine.toLowerCase()}>
                        {cuisine}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="pending_documents">Pending Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Loading restaurants...</p>
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Cuisine</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRestaurants.map((restaurant) => (
                    <TableRow key={restaurant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={restaurant.image || "/placeholder.svg"}
                              alt={restaurant.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {restaurant.address}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{restaurant.owner.name}</div>
                          <div className="text-sm text-muted-foreground">{restaurant.owner.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {restaurant.cuisine.map((type, index) => (
                            <Badge key={index} variant="outline" className="bg-muted/50">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{restaurant.rating}</span>
                          <span className="text-muted-foreground ml-1">({restaurant.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(restaurant.status)} text-white`}>
                          {getStatusName(restaurant.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{restaurant.orders.toLocaleString()}</TableCell>
                      <TableCell>${restaurant.revenue.toLocaleString()}</TableCell>
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
                              onClick={() => router.push(`/dashboard/admin/restaurants/${restaurant.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/admin/restaurants/${restaurant.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {restaurant.status === "active" ? (
                              <DropdownMenuItem className="text-amber-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Suspend
                              </DropdownMenuItem>
                            ) : restaurant.status === "suspended" ? (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Reactivate
                              </DropdownMenuItem>
                            ) : restaurant.status.startsWith("pending") ? (
                              <DropdownMenuItem className="text-green-600">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedRestaurant(restaurant)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
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
                <h3 className="text-lg font-medium mb-2">No restaurants found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setCuisineFilter("all")
                    setStatusFilter("all")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this restaurant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRestaurant && (
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="h-10 w-10 rounded-md overflow-hidden">
                  <img
                    src={selectedRestaurant.image || "/placeholder.svg"}
                    alt={selectedRestaurant.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{selectedRestaurant.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedRestaurant.address}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteRestaurant}>
              Delete Restaurant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


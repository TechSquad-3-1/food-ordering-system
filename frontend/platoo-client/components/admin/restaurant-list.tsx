"use client"

import { useState } from "react"
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, ArrowUpDown, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
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
interface Restaurant {
  id: string
  name: string
  location: string
  status: "active" | "closed" | "suspended"
  rating: number
  totalOrders: number
  categoriesCount: number
  menuItemsCount: number
  ownerName: string
}

export function RestaurantList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "orders">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data - in a real app, this would be fetched from an API
  const restaurants: Restaurant[] = [
    {
      id: "rest-1",
      name: "Burger Palace",
      location: "123 Main St, Anytown, CA 94321",
      status: "active",
      rating: 4.7,
      totalOrders: 1245,
      categoriesCount: 5,
      menuItemsCount: 32,
      ownerName: "John Smith",
    },
    {
      id: "rest-2",
      name: "Pizza Heaven",
      location: "456 Oak Ave, Anytown, CA 94321",
      status: "active",
      rating: 4.5,
      totalOrders: 987,
      categoriesCount: 4,
      menuItemsCount: 28,
      ownerName: "Sarah Johnson",
    },
    {
      id: "rest-3",
      name: "Sushi Express",
      location: "789 Pine St, Anytown, CA 94321",
      status: "closed",
      rating: 4.8,
      totalOrders: 756,
      categoriesCount: 6,
      menuItemsCount: 45,
      ownerName: "David Chen",
    },
    {
      id: "rest-4",
      name: "Taco Time",
      location: "321 Elm St, Anytown, CA 94321",
      status: "active",
      rating: 4.2,
      totalOrders: 543,
      categoriesCount: 3,
      menuItemsCount: 18,
      ownerName: "Maria Rodriguez",
    },
    {
      id: "rest-5",
      name: "Pasta Palace",
      location: "654 Maple Ave, Anytown, CA 94321",
      status: "suspended",
      rating: 3.9,
      totalOrders: 321,
      categoriesCount: 4,
      menuItemsCount: 22,
      ownerName: "Robert Johnson",
    },
  ]

  // Filter and sort restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.ownerName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || restaurant.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "rating") {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
      } else if (sortBy === "orders") {
        return sortOrder === "asc" ? a.totalOrders - b.totalOrders : b.totalOrders - a.totalOrders
      }
      return 0
    })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage)
  const paginatedRestaurants = filteredRestaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const toggleSort = (column: "name" | "rating" | "orders") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getStatusColor = (status: Restaurant["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "closed":
        return "bg-yellow-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Restaurants</CardTitle>
            <CardDescription>Manage all restaurants in the system</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Restaurant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center w-full md:w-auto">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("name")}>
                    Restaurant
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("rating")}>
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => toggleSort("orders")}>
                    Orders
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRestaurants.length > 0 ? (
                paginatedRestaurants.map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{restaurant.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{restaurant.ownerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{restaurant.totalOrders}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(restaurant.status)} text-white`}>{restaurant.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/restaurants/${restaurant.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No restaurants found
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


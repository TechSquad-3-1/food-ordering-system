"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, MoreVertical, Edit, Trash2, Copy, Eye, ArrowUpDown, Filter, ImagePlus } from "lucide-react"

// Mock data for menu items
const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    price: "$12.99",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: true,
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: "$14.99",
    description: "Pizza topped with pepperoni slices and cheese",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: true,
  },
  {
    id: 3,
    name: "Chicken Alfredo",
    category: "Pasta",
    price: "$15.99",
    description: "Fettuccine pasta with creamy alfredo sauce and grilled chicken",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: false,
  },
  {
    id: 4,
    name: "Caesar Salad",
    category: "Salad",
    price: "$8.99",
    description: "Romaine lettuce with Caesar dressing, croutons, and parmesan",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: false,
  },
  {
    id: 5,
    name: "Garlic Bread",
    category: "Appetizer",
    price: "$4.99",
    description: "Toasted bread with garlic butter and herbs",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: true,
  },
  {
    id: 6,
    name: "Tiramisu",
    category: "Dessert",
    price: "$7.99",
    description: "Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: false,
  },
  {
    id: 7,
    name: "Chocolate Lava Cake",
    category: "Dessert",
    price: "$6.99",
    description: "Warm chocolate cake with a molten chocolate center",
    image: "/placeholder.svg?height=80&width=80",
    available: false,
    popular: true,
  },
  {
    id: 8,
    name: "Soda",
    category: "Beverage",
    price: "$2.99",
    description: "Assorted soft drinks",
    image: "/placeholder.svg?height=80&width=80",
    available: true,
    popular: false,
  },
]

// Mock data for categories
const categories = [
  { id: 1, name: "Pizza", itemCount: 2 },
  { id: 2, name: "Pasta", itemCount: 1 },
  { id: 3, name: "Salad", itemCount: 1 },
  { id: 4, name: "Appetizer", itemCount: 1 },
  { id: 5, name: "Dessert", itemCount: 2 },
  { id: 6, name: "Beverage", itemCount: 1 },
]

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleEditItem = (item: any) => {
    setSelectedItem(item)
    setIsAddItemOpen(true)
  }

  const handleToggleAvailability = (id: number) => {
    // In a real app, this would update the item availability in the database
    console.log(`Toggling availability for item ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Create and manage your restaurant menu items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditCategoryOpen(true)}>
            Manage Categories
          </Button>
          <Button
            onClick={() => {
              setSelectedItem(null)
              setIsAddItemOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search menu items..."
                  className="pl-8 w-[200px] sm:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="p-4">
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>{filteredItems.length} items found</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{item.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={item.available} onCheckedChange={() => handleToggleAvailability(item.id)} />
                          <span className={item.available ? "text-green-600" : "text-red-600"}>
                            {item.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.popular && <Badge className="bg-orange-500 hover:bg-orange-600">Popular</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditItem(item)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No menu items found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle>Menu Categories</CardTitle>
              <CardDescription>Organize your menu with categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.itemCount} items</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <Button variant="ghost" className="w-full h-24" onClick={() => setIsEditCategoryOpen(true)}>
                      <Plus className="mr-2 h-5 w-5" />
                      Add New Category
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Menu Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            <DialogDescription>
              {selectedItem ? "Update the details of your menu item" : "Add a new item to your restaurant menu"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div className="space-y-2">
                <Label htmlFor="item-image">Item Image</Label>
                <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4">
                  {selectedItem ? (
                    <div className="text-center">
                      <img
                        src={selectedItem.image || "/placeholder.svg"}
                        alt={selectedItem.name}
                        className="mx-auto h-32 w-32 rounded-md object-cover"
                      />
                      <Button variant="outline" size="sm" className="mt-2">
                        <ImagePlus className="mr-2 h-4 w-4" /> Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          Upload Image
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG or GIF, max 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input id="item-name" placeholder="Enter item name" defaultValue={selectedItem?.name || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  placeholder="Enter item description"
                  defaultValue={selectedItem?.description || ""}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-price">Price</Label>
                  <Input id="item-price" placeholder="$0.00" defaultValue={selectedItem?.price || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <select
                    id="item-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={selectedItem?.category || ""}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="item-available" defaultChecked={selectedItem?.available ?? true} />
                  <Label htmlFor="item-available">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="item-popular" defaultChecked={selectedItem?.popular ?? false} />
                  <Label htmlFor="item-popular">Mark as Popular</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-options">Item Options (Optional)</Label>
                <div className="border rounded-md p-4">
                  <p className="text-sm text-muted-foreground mb-2">Add options like size, toppings, etc.</p>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Option Group
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
              Cancel
            </Button>
            <Button>{selectedItem ? "Update Item" : "Add Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Categories Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>Create and organize your menu categories</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-category">Add New Category</Label>
              <div className="flex gap-2">
                <Input id="new-category" placeholder="Category name" />
                <Button>Add</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Existing Categories</Label>
              <div className="border rounded-md divide-y">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3">
                    <div>
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">({category.itemCount} items)</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


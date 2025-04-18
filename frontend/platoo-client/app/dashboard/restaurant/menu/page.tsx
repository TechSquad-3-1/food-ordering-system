"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  ArrowUpDown,
  Filter,
  ImagePlus,
} from "lucide-react";

// Interfaces
interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  is_available: boolean;
  is_veg: boolean;
}

interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  image_url: string;
  is_active: boolean;
  itemCount: number;
}

const RESTAURANT_ID = "67ea74b67ec2521671a97f93";

export default function MenuPage() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Category dialog state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<Omit<Category, "id" | "itemCount">>({
    restaurant_id: RESTAURANT_ID,
    name: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch menu items and categories
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/menu-items/restaurant/${RESTAURANT_ID}`);
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        const normalized = data.map((item: any) => ({
          ...item,
          id: item._id || item.id,
        }));
        setMenuItems(normalized);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/category/${RESTAURANT_ID}`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        const normalized = data.map((category: any) => ({
          ...category,
          id: category._id || category.id,
        }));
        setCategories(normalized);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchMenuItems();
    fetchCategories();
  }, []);

  // Filtering
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== "all" && item.category_id !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Category CRUD handlers
  const openAddCategoryDialog = () => {
    setEditingCategory(null);
    setCategoryForm({
      restaurant_id: RESTAURANT_ID,
      name: "",
      description: "",
      image_url: "",
      is_active: true,
    });
    setIsCategoryDialogOpen(true);
  };

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      restaurant_id: category.restaurant_id,
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      is_active: category.is_active,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleCategoryFormChange = (field: keyof Omit<Category, "id" | "itemCount">, value: any) => {
    setCategoryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });
      if (!response.ok) throw new Error("Failed to add category");
      const newCategory: Category = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      setIsCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      const response = await fetch(`http://localhost:3001/api/category/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingCategory, ...categoryForm }),
      });
      if (!response.ok) throw new Error("Failed to update category");
      const updated: Category = await response.json();
      setCategories((prev) =>
        prev.map((cat) => (cat.id === updated.id ? updated : cat))
      );
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/category/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete category");
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Menu item handlers
  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsAddItemOpen(true);
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      const updatedAvailability = !menuItems.find((item) => item.id === id)?.is_available;
      const response = await fetch(`http://localhost:3001/api/menu-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: updatedAvailability }),
      });
      if (!response.ok) throw new Error("Failed to update availability");
      const updatedItem: MenuItem = await response.json();
      setMenuItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menu-items/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete menu item");
      setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const handleAddItem = async (newItem: Omit<MenuItem, "id">) => {
    try {
      const response = await fetch("http://localhost:3001/api/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) throw new Error("Failed to add menu item");
      const addedItem: MenuItem = await response.json();
      setMenuItems((prevItems) => [...prevItems, addedItem]);
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleUpdateItem = async (updatedItem: MenuItem) => {
    try {
      const response = await fetch(`http://localhost:3001/api/menu-items/${updatedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) throw new Error("Failed to update menu item");
      const updatedData: MenuItem = await response.json();
      setMenuItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedData.id ? updatedData : item))
      );
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Create and manage your restaurant menu items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openAddCategoryDialog}>
            Manage Categories
          </Button>
          <Button onClick={() => setIsAddItemOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Tabs for Menu Items and Categories */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        {/* Menu Items Tab Content */}
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
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
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
                            src={item.image_url || "/placeholder.svg"}
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
                        <Badge variant="outline">
                          {categories.find((cat) => cat.id === item.category_id)?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.is_available}
                            onCheckedChange={() => handleToggleAvailability(item.id)}
                          />
                          <span className={item.is_available ? "text-green-600" : "text-red-600"}>
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.is_veg && <Badge className="bg-orange-500 hover:bg-orange-600">Vegetarian</Badge>}
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
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(item.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab Content */}
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
                      <div className="flex items-center gap-4">
                        {category.image_url && (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-16 w-16 rounded-lg object-cover border"
                          />
                        )}
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.itemCount} items
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditCategoryDialog(category)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <Button
                      variant="ghost"
                      className="w-full h-24"
                      onClick={openAddCategoryDialog}
                    >
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

      {/* Add/Edit Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the details of your category"
                : "Add a new category to your restaurant"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(e) => handleCategoryFormChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                placeholder="Category description"
                value={categoryForm.description}
                onChange={(e) => handleCategoryFormChange("description", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-image">Image URL</Label>
              <Input
                id="category-image"
                placeholder="https://example.com/image.jpg"
                value={categoryForm.image_url}
                onChange={(e) => handleCategoryFormChange("image_url", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="category-active"
                checked={categoryForm.is_active}
                onCheckedChange={(checked) => handleCategoryFormChange("is_active", checked)}
              />
              <Label htmlFor="category-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
            >
              {editingCategory ? "Update Category" : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Menu Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
            <DialogDescription>
              {selectedItem
                ? "Update the details of your menu item"
                : "Add a new item to your restaurant menu"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              {/* Image Upload/Preview */}
              <div className="space-y-2">
                <Label htmlFor="item-image">Item Image</Label>
                <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4">
                  {selectedItem?.image_url ? (
                    <div className="text-center">
                      <img
                        src={selectedItem.image_url}
                        alt={selectedItem.name}
                        className="mx-auto h-32 w-32 rounded-md object-cover"
                      />
                      <Button variant="outline" size="sm" className="mt-2" disabled>
                        <ImagePlus className="mr-2 h-4 w-4" /> Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-2">
                        <Button variant="outline" size="sm" disabled>
                          Upload Image
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG or GIF, max 2MB</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  placeholder="Enter item name"
                  defaultValue={selectedItem?.name || ""}
                />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  placeholder="Enter item description"
                  defaultValue={selectedItem?.description || ""}
                  rows={3}
                />
              </div>
              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-price">Price</Label>
                  <Input
                    id="item-price"
                    placeholder="$0.00"
                    defaultValue={selectedItem?.price || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-category">Category</Label>
                  <select
                    id="item-category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={selectedItem?.category_id || ""}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Availability and Veg Switches */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="item-available"
                    defaultChecked={selectedItem?.is_available ?? true}
                  />
                  <Label htmlFor="item-available">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="item-veg"
                    defaultChecked={selectedItem?.is_veg ?? false}
                  />
                  <Label htmlFor="item-veg">Vegetarian</Label>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const name = (document.getElementById("item-name") as HTMLInputElement).value;
                const description = (document.getElementById("item-description") as HTMLTextAreaElement).value;
                const price = (document.getElementById("item-price") as HTMLInputElement).value;
                const category_id = (document.getElementById("item-category") as HTMLSelectElement).value;
                const is_available = (document.getElementById("item-available") as HTMLInputElement).checked;
                const is_veg = (document.getElementById("item-veg") as HTMLInputElement).checked;
                const image_url = selectedItem?.image_url || ""; // You can extend to allow upload

                if (!name || !category_id || !price) return;

                const newItem = {
                  name,
                  description,
                  price,
                  category_id,
                  is_available,
                  is_veg,
                  image_url,
                };

                if (selectedItem) {
                  await handleUpdateItem({ ...selectedItem, ...newItem });
                } else {
                  await handleAddItem(newItem as any);
                }
                setIsAddItemOpen(false);
                setSelectedItem(null);
              }}
            >
              {selectedItem ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

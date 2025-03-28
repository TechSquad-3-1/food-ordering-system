"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Star, Clock, MapPin, Heart, Minus, Plus, ShoppingCart, X } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  popular?: boolean
  vegetarian?: boolean
  spicy?: boolean
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

interface Restaurant {
  id: string
  name: string
  image: string
  coverImage: string
  logo: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: string
  minOrder: string
  distance: string
  address: string
  cuisines: string[]
  priceLevel: number
  description: string
  menu: MenuCategory[]
}

interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    // In a real app, fetch restaurant data from API
    // For demo purposes, we'll use mock data
    const fetchRestaurant = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockRestaurant: Restaurant = {
          id: id as string,
          name: "Burger Palace",
          image: "/placeholder.svg?height=200&width=300",
          coverImage: "/placeholder.svg?height=400&width=1200",
          logo: "/placeholder.svg?height=100&width=100",
          rating: 4.7,
          reviewCount: 253,
          deliveryTime: "15-25 min",
          deliveryFee: "$1.99",
          minOrder: "$10",
          distance: "1.2 miles",
          address: "123 Main St, Washington, DC",
          cuisines: ["American", "Fast Food", "Burgers"],
          priceLevel: 2,
          description:
            "Burger Palace offers the juiciest burgers in town, made with 100% Angus beef and fresh ingredients. Our menu includes a variety of burgers, sides, and shakes to satisfy your cravings.",
          menu: [
            {
              id: "cat1",
              name: "Popular Items",
              items: [
                {
                  id: "item1",
                  name: "Classic Cheeseburger",
                  description:
                    "Angus beef patty with cheddar cheese, lettuce, tomato, onion, and our special sauce on a brioche bun",
                  price: 8.99,
                  image: "/placeholder.svg?height=120&width=120",
                  popular: true,
                },
                {
                  id: "item2",
                  name: "Bacon Deluxe Burger",
                  description:
                    "Angus beef patty with crispy bacon, cheddar cheese, lettuce, tomato, and mayo on a brioche bun",
                  price: 10.99,
                  image: "/placeholder.svg?height=120&width=120",
                  popular: true,
                },
                {
                  id: "item7",
                  name: "Loaded Fries",
                  description: "Crispy fries topped with cheese sauce, bacon bits, and green onions",
                  price: 5.99,
                  image: "/placeholder.svg?height=120&width=120",
                  popular: true,
                },
              ],
            },
            {
              id: "cat2",
              name: "Burgers",
              items: [
                {
                  id: "item1",
                  name: "Classic Cheeseburger",
                  description:
                    "Angus beef patty with cheddar cheese, lettuce, tomato, onion, and our special sauce on a brioche bun",
                  price: 8.99,
                  image: "/placeholder.svg?height=120&width=120",
                  popular: true,
                },
                {
                  id: "item2",
                  name: "Bacon Deluxe Burger",
                  description:
                    "Angus beef patty with crispy bacon, cheddar cheese, lettuce, tomato, and mayo on a brioche bun",
                  price: 10.99,
                  image: "/placeholder.svg?height=120&width=120",
                  popular: true,
                },
                {
                  id: "item3",
                  name: "Double Trouble Burger",
                  description:
                    "Two Angus beef patties with double cheese, lettuce, tomato, onion, and special sauce on a brioche bun",
                  price: 12.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item4",
                  name: "Veggie Burger",
                  description: "Plant-based patty with lettuce, tomato, onion, and vegan mayo on a whole grain bun",
                  price: 9.99,
                  image: "/placeholder.svg?height=120&width=120",
                  vegetarian: true,
                },
                {
                  id: "item5",
                  name: "Spicy Jalapeño Burger",
                  description:
                    "Angus beef patty with pepper jack cheese, jalapeños, lettuce, tomato, and spicy mayo on a brioche bun",
                  price: 10.99,
                  image: "/placeholder.svg?height=120&width=120",
                  spicy: true,
                },
              ],
            },
            {
              id: "cat3",
              name: "Sides",
              items: [
                {
                  id: "item6",
                  name: "French Fries",
                  description: "Crispy golden fries with sea salt",
                  price: 3.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item7",
                  name: "Loaded Fries",
                  description: "Crispy fries topped with cheese sauce, bacon bits, and green onions",
                  price: 5.99,
                  image: "/placeholder.svg?height=120&width=120",
                  popular: true,
                },
                {
                  id: "item8",
                  name: "Onion Rings",
                  description: "Crispy battered onion rings with dipping sauce",
                  price: 4.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item9",
                  name: "Side Salad",
                  description: "Fresh mixed greens with cherry tomatoes, cucumber, and choice of dressing",
                  price: 4.49,
                  image: "/placeholder.svg?height=120&width=120",
                  vegetarian: true,
                },
              ],
            },
            {
              id: "cat4",
              name: "Drinks",
              items: [
                {
                  id: "item10",
                  name: "Fountain Soda",
                  description: "Choice of Coke, Diet Coke, Sprite, or Dr. Pepper",
                  price: 2.49,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item11",
                  name: "Chocolate Milkshake",
                  description: "Creamy chocolate milkshake topped with whipped cream",
                  price: 5.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item12",
                  name: "Vanilla Milkshake",
                  description: "Creamy vanilla milkshake topped with whipped cream",
                  price: 5.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item13",
                  name: "Strawberry Milkshake",
                  description: "Creamy strawberry milkshake topped with whipped cream",
                  price: 5.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
              ],
            },
            {
              id: "cat5",
              name: "Desserts",
              items: [
                {
                  id: "item14",
                  name: "Chocolate Chip Cookie",
                  description: "Freshly baked chocolate chip cookie",
                  price: 1.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item15",
                  name: "Brownie Sundae",
                  description: "Warm chocolate brownie topped with vanilla ice cream and chocolate sauce",
                  price: 6.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
                {
                  id: "item16",
                  name: "Apple Pie",
                  description: "Warm apple pie with a flaky crust",
                  price: 4.99,
                  image: "/placeholder.svg?height=120&width=120",
                },
              ],
            },
          ],
        }

        setRestaurant(mockRestaurant)
        if (mockRestaurant.menu.length > 0) {
          setActiveCategory(mockRestaurant.menu[0].id)
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurant()

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [id])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.menuItemId === item.id)

      if (existingItem) {
        // Item already in cart, increase quantity
        return prevCart.map((cartItem) =>
          cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        // Add new item to cart
        return [
          ...prevCart,
          {
            id: `cart-${Date.now()}`,
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
          },
        ]
      }
    })

    // Show cart after adding item
    setIsCartOpen(true)
  }

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId))
  }

  const updateCartItemQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item)))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const getPriceLevelString = (level: number) => {
    return Array(level).fill("$").join("")
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={getCartItemCount()} />
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500">Loading restaurant information...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={getCartItemCount()} />
        <div className="flex flex-col justify-center items-center h-[50vh]">
          <p className="text-gray-500 mb-4">Restaurant not found</p>
          <Button onClick={() => router.push("/restaurants")}>Back to Restaurants</Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={getCartItemCount()} />

      <main className="pb-20">
        {/* Restaurant Cover Image */}
        <div className="relative h-64 md:h-80 bg-gray-200">
          <img
            src={restaurant.coverImage || "/placeholder.svg"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <div className="max-w-[1400px] mx-auto flex items-end">
              <div className="mr-4 bg-white rounded-lg p-1 shadow-md">
                <img
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={`${restaurant.name} logo`}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{restaurant.rating}</span>
                    <span className="ml-1 text-sm">({restaurant.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{restaurant.distance}</span>
                  </div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                    {getPriceLevelString(restaurant.priceLevel)}
                  </Badge>
                </div>
              </div>
              <div className="ml-auto">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.cuisines.map((cuisine, index) => (
                <Badge key={index} variant="secondary">
                  {cuisine}
                </Badge>
              ))}
            </div>
            <p className="text-gray-700 mb-4">{restaurant.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Delivery Fee:</span> {restaurant.deliveryFee}
              </div>
              <div>
                <span className="font-medium">Min Order:</span> {restaurant.minOrder}
              </div>
              <div>
                <span className="font-medium">Address:</span> {restaurant.address}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Menu Categories Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
                <h3 className="font-bold text-lg mb-4">Menu</h3>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="pr-4 space-y-1">
                    {restaurant.menu.map((category) => (
                      <button
                        key={category.id}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeCategory === category.id
                            ? "bg-red-50 text-red-500 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Menu Items */}
            <div className="md:w-3/4">
              <div className="space-y-8">
                {restaurant.menu.map((category) => (
                  <div
                    key={category.id}
                    id={category.id}
                    className={activeCategory === category.id ? "" : "hidden md:block"}
                  >
                    <h2 className="font-bold text-xl mb-4">{category.name}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {category.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="flex p-4">
                            <div className="flex-1 pr-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold">{item.name}</h3>
                                  <div className="flex gap-2 mt-1">
                                    {item.popular && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-yellow-50 border-yellow-200 text-yellow-700"
                                      >
                                        Popular
                                      </Badge>
                                    )}
                                    {item.vegetarian && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-green-50 border-green-200 text-green-700"
                                      >
                                        Vegetarian
                                      </Badge>
                                    )}
                                    {item.spicy && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-red-50 border-red-200 text-red-700"
                                      >
                                        Spicy
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="font-bold">${item.price.toFixed(2)}</div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                              <Button className="mt-3 bg-red-500 hover:bg-red-600" onClick={() => addToCart(item)}>
                                Add to Cart
                              </Button>
                            </div>
                            {item.image && (
                              <div className="w-24 h-24 flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Order</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add items from the menu to start your order</p>
                <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                  Browse Menu
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-auto -mx-6 px-6">
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center">
                          <div className="flex border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="h-8 w-8 flex items-center justify-center text-sm">{item.quantity}</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="font-medium mr-3">${(item.price * item.quantity).toFixed(2)}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t mt-auto pt-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>{restaurant.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>
                        ${(getCartTotal() + Number.parseFloat(restaurant.deliveryFee.replace("$", ""))).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-red-500 hover:bg-red-600" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Button (Mobile) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:hidden">
          <Button className="w-full bg-red-500 hover:bg-red-600" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Cart ({getCartItemCount()} items) - ${getCartTotal().toFixed(2)}
          </Button>
        </div>
      )}

      <Footer />
    </div>
  )
}


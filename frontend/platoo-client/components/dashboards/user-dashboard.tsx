"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, MapPin, ChevronDown, X, Info, Clock, ThumbsUp, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserDashboardProps {
  userId: string
}

export default function UserDashboard({ userId }: UserDashboardProps) {
  const [address, setAddress] = useState("Sri Lanka")
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(2)
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(true)
  const router = useRouter()

  const categories = [
    { id: "1", name: "Pizza", image: "/pizza.jpg" },
    { id: "2", name: "Burgers", image: "/burger.jpg" },
    { id: "3", name: "Healthy", image: "/healthy.jpg" },
    { id: "4", name: "Desserts", image: "/deserts.jpg" },
    { id: "5", name: "Asian", image: "/asian.png" },
    { id: "6", name: "Italian", image: "/italian.jpg" },
  ]

  const restaurants = [
    {
      id: "1",
      name: "Burger Palace",
      image: "/r1.jpg",
      rating: 4.7,
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99",
      cuisine: ["Burgers", "American", "Fast Food"],
    },
    {
      id: "2",
      name: "Pizza Heaven",
      image: "/r2.jpg",
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "$2.49",
      cuisine: ["Pizza", "Italian"],
    },
    {
      id: "2",
      name: "Pizza Heaven",
      image: "/r3.jpg",
      rating: 4.5,
      deliveryTime: "20-30 min",
      deliveryFee: "$2.49",
      cuisine: ["Pizza", "Italian"],
    },
    // Add more restaurant items as needed
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center gap-12">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-red-500">platoo.</span>
            </Link>

            <nav className="hidden md:flex items-center">
              <Link href="/dashboard" className="text-sm font-medium border-b-2 border-red-500 pb-1 px-4">
                Find food
              </Link>
              <Link href="/categories" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4">
                Categories
              </Link>
              <Link href="/restaurants" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4">
                Restaurants
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4">
                About us
              </Link>
            </nav>
          </div>

          {/* Right side - Phone, Account, Cart, Order button */}
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm font-medium text-gray-600">+1 202 555 0104</span>

            <div className="relative">
              <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                Account <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>

            <div className="relative">
              <Link href="/cart" className="flex items-center justify-center h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <Button className="hidden md:flex bg-red-500 hover:bg-red-600 rounded-md">Confirm order</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/backgroundHome.jpg')" }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container mx-auto px-6 pt-24 pb-16 relative z-10 flex flex-col lg:flex-row items-center justify-center text-center">
            {/* Left Side - Content */}
            <div className="text-white">
              <div className="flex items-center justify-center mb-6 text-lg">
                <MapPin className="h-5 w-5 text-red-500 mr-2" />
                <span>{address}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Discover restaurants that deliver near you.
              </h1>

              <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-8">
                <Input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="pr-16 h-12 rounded-full border-gray-300 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 text-white" />
                </Button>
              </form>

              {/* Call to Action */}
              <div className="flex justify-center gap-6 mb-6">
                <Button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Now
                </Button>
                <Button className="bg-transparent border-2 border-white text-white py-2 px-6 rounded-full flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </div>

              {/* Icons */}
              <div className="flex justify-center gap-6 text-white">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-red-500" />
                  <span className="text-sm">Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-6 w-6 text-red-500" />
                  <span className="text-sm">Highly Rated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-6 w-6 text-red-500" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

          </div>
        </div>



        {/* Food Categories */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link href={`/category/${category.id}`} key={category.id}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square relative">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Restaurants */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Link href={`/restaurant/${restaurant.id}`} key={restaurant.id}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                    <div className="aspect-video relative">
                      <img
                        src={restaurant.image || "/placeholder.svg"}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white text-gray-900">★ {restaurant.rating}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{restaurant.name}</h3>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {restaurant.cuisine.map((type, index) => (
                          <span key={index} className="text-xs text-gray-500">
                            {type}
                            {index < restaurant.cuisine.length - 1 ? " • " : ""}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{restaurant.deliveryTime}</span>
                        <span>{restaurant.deliveryFee} delivery</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                View All Restaurants
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Find Food</h3>
                <p className="text-gray-600">Browse restaurants and cuisines near you</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Place Order</h3>
                <p className="text-gray-600">Choose your favorite dishes and checkout</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Food is prepared and delivered to your door</p>
              </div>
            </div>
          </div>
        </section>

        
      </main>
{/* Footer */}
<footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Platoo</h3>
              <p className="text-gray-600 mb-4">Delicious food delivered to your door.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/restaurants" className="text-gray-600 hover:text-gray-900">
                    Restaurants
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="text-gray-600 hover:text-gray-900">
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="/popular" className="text-gray-600 hover:text-gray-900">
                    Popular Items
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-600 hover:text-gray-900">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Platoo. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Privacy Policy Popup */}
      {showPrivacyPolicy && (
        <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border p-4 z-20">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium">What about Privacy Policy?</h3>
            </div>
            <button className="text-gray-400 hover:text-gray-500" onClick={() => setShowPrivacyPolicy(false)}>
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
          At Platoo, your privacy is important to us. This policy explains how we collect and use your personal information when you use our services.
          </p>
          <Link href="/privacy" className="text-sm text-red-500 font-medium hover:text-red-600">
            See more
          </Link>
        </div>
      )}
    </div>
  )
}

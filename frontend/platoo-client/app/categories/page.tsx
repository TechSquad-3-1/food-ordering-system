import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function CategoriesPage() {
  return (
    <div>
        <Header cartCount={1} />
        <div className="container py-8">

            <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Food Categories</h1>
                <p className="text-gray-500">Browse our menu by category</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input placeholder="Search for categories..." className="pl-10" />
                </div>
                <Tabs defaultValue="all" className="w-full md:w-auto">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
                </Tabs>
            </div>

            {/* Featured Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredCategories.map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.name}>
                    <Card className="overflow-hidden h-48 relative group">
                    <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                        <div className="text-white">
                        <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                        <p className="text-white/80 mb-4">{category.description}</p>
                        <Button
                            variant="outline"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-sm"
                        >
                            Explore <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    </Card>
                </Link>
                ))}
            </div>

            {/* All Categories */}
            <h2 className="text-2xl font-bold mt-4">All Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {allCategories.map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.name}>
                    <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                    <div className="aspect-square relative">
                        <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover p-4"
                        />
                    </div>
                    <div className="p-3 text-center">
                        <h3 className="font-medium">{category.name}</h3>
                    </div>
                    </Card>
                </Link>
                ))}
            </div>
            </div>
            </div>
            <Footer />
    </div>
  )
}

const featuredCategories = [
  {
    name: "Italian Cuisine",
    slug: "italian",
    description: "Authentic pizzas, pastas, and more from Italy's finest recipes",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    name: "Asian Delights",
    slug: "asian",
    description: "Explore flavors from across Asia, from sushi to spicy curries",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    name: "Healthy Options",
    slug: "healthy",
    description: "Nutritious and delicious meals for the health-conscious",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    name: "Quick Bites",
    slug: "quick-bites",
    description: "Fast food favorites delivered in minutes",
    image: "/placeholder.svg?height=400&width=600",
  },
]

const allCategories = [
  { name: "Pizza", slug: "pizza", image: "/placeholder.svg?height=200&width=200" },
  { name: "Burgers", slug: "burgers", image: "/placeholder.svg?height=200&width=200" },
  { name: "Sushi", slug: "sushi", image: "/placeholder.svg?height=200&width=200" },
  { name: "Desserts", slug: "desserts", image: "/placeholder.svg?height=200&width=200" },
  { name: "Indian", slug: "indian", image: "/placeholder.svg?height=200&width=200" },
  { name: "Mexican", slug: "mexican", image: "/placeholder.svg?height=200&width=200" },
  { name: "Thai", slug: "thai", image: "/placeholder.svg?height=200&width=200" },
  { name: "Chinese", slug: "chinese", image: "/placeholder.svg?height=200&width=200" },
  { name: "Vegetarian", slug: "vegetarian", image: "/placeholder.svg?height=200&width=200" },
  { name: "Vegan", slug: "vegan", image: "/placeholder.svg?height=200&width=200" },
  { name: "Seafood", slug: "seafood", image: "/placeholder.svg?height=200&width=200" },
  { name: "Breakfast", slug: "breakfast", image: "/placeholder.svg?height=200&width=200" },
]

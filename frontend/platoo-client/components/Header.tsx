"use client"

import { ChevronDown, ShoppingCart, User } from "lucide-react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation" // Import usePathname here

const Header = ({ cartCount }: { cartCount: number }) => {
  const router = useRouter()
  const currentPath = usePathname() // Use usePathname() to get the current route

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user");  // Remove user data from localStorage
    router.push("/login"); // Redirect to login page
  }

  const handleProfileRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      router.push("/profile"); // If logged in, redirect to profile
    }
  }

  const getLinkClassName = (path: string) => {
    // Check if current path starts with the given base path
    return currentPath?.startsWith(path)
      ? "text-sm font-medium border-b-2 border-red-500 pb-1 px-4"
      : "text-sm font-medium text-gray-600 hover:text-gray-900 px-4"
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-12">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-red-500">platoo.</span>
          </Link>

          <nav className="hidden md:flex items-center">
            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
              Home
            </Link>
            <Link href="/categories" className={getLinkClassName("/categories")}>
              Categories
            </Link>
            <Link href="/restaurants" className={getLinkClassName("/restaurants")}>
              Restaurants
            </Link>
            <Link href="/about" className={getLinkClassName("/about")}>
              About us
            </Link>
          </nav>
        </div>

        {/* Right side - Phone, Account, Cart, Order button */}
        <div className="flex items-center gap-6">
          <span className="hidden md:block text-sm font-medium text-gray-600">+1 202 555 0104</span>

          {/* Account Dropdown */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                  <User className="h-5 w-5 text-gray-600" />
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <DropdownMenuLabel>Account Options</DropdownMenuLabel>
                <DropdownMenuItem>
                  <button onClick={handleProfileRedirect} className="block text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 rounded">
                    Profile
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders/history" className="block text-sm text-gray-700 hover:bg-gray-100 px-4 py-2 rounded">
                    Order History
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Cart Icon */}
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

          {/* Sign Out Button */}
          <Button className="bg-gray-500 hover:bg-gray-600 rounded-md" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header

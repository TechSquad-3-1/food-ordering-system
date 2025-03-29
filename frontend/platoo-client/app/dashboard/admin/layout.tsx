"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { jwtDecode } from "jwt-decode"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Truck,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Search,
  HelpCircle,
  MessageSquare,
} from "lucide-react"

interface JwtPayload {
  id: string
  role: string
  name?: string
  email?: string
  iat: number
  exp: number
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<{
    id: string
    name: string
    email: string
    role: string
  } | null>(null)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    try {
      // Decode the JWT token to get user role
      const decoded = jwtDecode<JwtPayload>(token)

      if (decoded.role !== "admin") {
        // Redirect non-admin users
        router.push("/dashboard")
        return
      }

      setUserData({
        id: decoded.id,
        name: decoded.name || "Admin User",
        email: decoded.email || "admin@example.com",
        role: decoded.role,
      })
    } catch (error) {
      console.error("Invalid token:", error)
      localStorage.removeItem("token")
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null,
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: <Users className="h-5 w-5" />,
      badge: null,
    },
    {
      title: "Restaurants",
      href: "/dashboard/admin/restaurants",
      icon: <Store className="h-5 w-5" />,
      badge: null,
    },
    {
      title: "Orders",
      href: "/dashboard/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      badge: { count: 12, variant: "default" },
    },
    {
      title: "Delivery",
      href: "/dashboard/admin/delivery",
      icon: <Truck className="h-5 w-5" />,
      badge: null,
    },
    {
      title: "Reports",
      href: "/dashboard/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      badge: null,
    },
    
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="mt-4 h-4 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard/admin" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500 text-white">
                <span className="text-lg font-bold">P</span>
              </div>
              <span className="text-lg font-bold">Platoo Admin</span>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <div className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 bg-muted/50" />
              </div>
            </div>

            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex justify-between w-full">
                      <div className="flex items-center">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && <Badge className="ml-auto bg-red-500 text-white">{item.badge.count}</Badge>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <SidebarSeparator className="my-4" />

            <div className="px-4 py-2">
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">Support</h3>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/admin/help">
                      <HelpCircle className="h-5 w-5" />
                      <span>Help Center</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/admin/messages">
                      <MessageSquare className="h-5 w-5" />
                      <span>Messages</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt={userData?.name || "Admin"} />
                  <AvatarFallback>{userData?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userData?.name}</p>
                  <p className="text-xs text-muted-foreground">{userData?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                {navItems.find((item) => item.href === pathname)?.title || "Admin Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications}
                  </span>
                )}
              </Button>

              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={userData?.name || "Admin"} />
                  <AvatarFallback>{userData?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userData?.name}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}


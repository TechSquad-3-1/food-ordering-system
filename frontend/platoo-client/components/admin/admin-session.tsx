"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Types
interface Admin {
  id: string
  name: string
  email: string
  role: "admin" | "super_admin"
  permissions: string[]
  avatar?: string
  lastLogin: string
}

interface AdminContextType {
  admin: Admin | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateAdminProfile: (data: Partial<Admin>) => Promise<Admin | undefined>; // Update this line
}

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Provider component
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await fetch('/api/admin/session')
        // if (response.ok) {
        //   const data = await response.json()
        //   setAdmin(data.admin)
        // }

        // Simulated session check
        const storedAdmin = localStorage.getItem("admin_session")
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin))
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API
      // const response = await fetch('/api/admin/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // if (!response.ok) throw new Error('Login failed')
      // const data = await response.json()
      // setAdmin(data.admin)

      // Simulated login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // This is just for demonstration - in a real app, this would come from your backend
      const mockAdmin: Admin = {
        id: "admin-123",
        name: "Admin User",
        email: email,
        role: "admin",
        permissions: ["users:read", "users:write", "orders:read", "orders:write", "restaurants:read"],
        lastLogin: new Date().toISOString(),
      }

      setAdmin(mockAdmin)
      localStorage.setItem("admin_session", JSON.stringify(mockAdmin))
      router.push("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // In a real app, you would call your API
      // await fetch('/api/admin/logout', { method: 'POST' })

      // Clear local state
      setAdmin(null)
      localStorage.removeItem("admin_session")
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  // Update admin profile
  const updateAdminProfile = async (data: Partial<Admin>) => {
    try {
      // In a real app, you would call your API
      // const response = await fetch('/api/admin/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // if (!response.ok) throw new Error('Update failed')
      // const updatedData = await response.json()

      // Simulated update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (admin) {
        const updatedAdmin = { ...admin, ...data }
        setAdmin(updatedAdmin)
        localStorage.setItem("admin_session", JSON.stringify(updatedAdmin))
        return updatedAdmin
      }
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  // Context value
  const value = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    logout,
    updateAdminProfile,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

// Custom hook to use the admin context
export function useAdminSession() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdminSession must be used within an AdminSessionProvider")
  }
  return context
}

// Auth guard component
export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminSession()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const Profile = () => {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Simulate fetching user data
  useEffect(() => {
    // Normally, fetch user data from an API or a global state
    const userData = JSON.parse(localStorage.getItem("user") || "{}") // Example from localStorage
    if (userData) {
      setUser(userData)
    }
  }, [])

  const handleSignOut = () => {
    // Clear session data and redirect to login
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading user profile...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
      
      <div className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
        <h2 className="text-xl font-medium text-gray-600">Personal Information</h2>
        <div className="mt-4">
          <p className="text-sm text-gray-500">Name: {user.name}</p>
          <p className="text-sm text-gray-500">Email: {user.email}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={() => router.push("/settings")} className="bg-blue-500 hover:bg-blue-600 text-white">
          Edit Profile
        </Button>
        <Button onClick={handleSignOut} className="bg-gray-500 hover:bg-gray-600 text-white">
          Sign Out
        </Button>
      </div>
    </div>
  )
}

export default Profile

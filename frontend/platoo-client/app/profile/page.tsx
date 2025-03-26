"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingCart, ChevronDown, User, MapPin, CreditCard, Clock, Settings, LogOut, Edit, PlusCircleIcon, PencilIcon, HomeIcon, AlertCircleIcon, CheckCircleIcon, MapPinIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    restaurantName?: string;
    vehicleNumber?: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    restaurantName?: string;
    vehicleNumber?: string;
  }>({
    name: "",
    email: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect to login if no token is found
      return;
    }

    const userId = localStorage.getItem("userId");

    if (userId) {
      fetchUserData(token, userId); // Fetch user data if userId is available
    } else {
      router.push("/login"); // Redirect to login if userId is missing
    }
  }, [router]);

  const fetchUserData = async (token: string, userId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:4000/api/auth/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          role: data.role,
          phone: data.phone,
          address: data.address,
          restaurantName: data.restaurantName,
          vehicleNumber: data.vehicleNumber,
        });
        localStorage.setItem("user", JSON.stringify(data)); // Store user data in localStorage
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login"); // Redirect to login if the user data fetch fails
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("user"); // Remove user data
    localStorage.removeItem("userId"); // Remove userId
    setUser(null); // Reset user state
    router.push("/login"); // Redirect to login page
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Profile update failed");
      }

      localStorage.setItem("user", JSON.stringify(formData)); // Update localStorage
      setUser(formData); // Update user state with the new data
      setIsEditing(false); // Exit the editing mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">User not found. Please <Link href="/login" className="text-red-500 hover:underline">login</Link> again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={2} />

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>

                <nav className="space-y-1">
                  <Link href="/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-red-50 text-red-500">
                    <User className="mr-3 h-5 w-5" />
                    Personal Information
                  </Link>
                  <Link href="/profile/addresses" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <MapPin className="mr-3 h-5 w-5" />
                    Delivery Addresses
                  </Link>
                  <Link href="/profile/orders" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Clock className="mr-3 h-5 w-5" />
                    Order History
                  </Link>
                  <Link href="/profile/payments" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <CreditCard className="mr-3 h-5 w-5" />
                    Payment Methods
                  </Link>
                  <Link href="/profile/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Settings className="mr-3 h-5 w-5" />
                    Account Settings
                  </Link>
                  <Separator className="my-2" />
                  <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : <><Edit className="mr-2 h-4 w-4" /> Edit</>}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                          <Input 
                            id="email"
                            name="email" 
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                          />
                        </div>

                        {/* Add role-based data */}
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="address" className="text-sm font-medium">Address</label>
                          <Input 
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>

                        {/* Conditional rendering for role-based attributes */}
                        {user.role === "restaurant_owner" && (
                          <>
                            <div className="space-y-2">
                              <label htmlFor="restaurantName" className="text-sm font-medium">Restaurant Name</label>
                              <Input
                                id="restaurantName"
                                name="restaurantName"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                          </>
                        )}

                        {user.role === "delivery_man" && (
                          <>
                            <div className="space-y-2">
                              <label htmlFor="vehicleNumber" className="text-sm font-medium">Vehicle Number</label>
                              <Input
                                id="vehicleNumber"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex justify-end">
                          <Button type="submit" className="bg-red-500 hover:bg-red-600">
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
            <TabsContent value="addresses">
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <MapPinIcon className="h-4 w-4 text-red-500" /> {/* Icon for Delivery Addresses */}
                        Delivery Addresses
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                        {user?.address ? (
                        <>
                            <CheckCircleIcon className="h-4 w-4 text-green-500" /> {/* Icon for existing address */}
                            Your current address: <span className="font-medium">{user.address}</span>
                        </>
                        ) : (
                        <>
                            <AlertCircleIcon className="h-4 w-4 text-yellow-500" /> {/* Icon for no address */}
                            You haven't added any delivery addresses yet. Add one to make ordering faster.
                        </>
                        )}
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="py-6">
                    {user?.address ? (
                        <div className="w-full max-w-md p-4 bg-white shadow-sm rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
                        <div className="flex justify-between items-center">
                            <p className="text-sm flex items-center gap-2">
                            <HomeIcon className="h-4 w-4 text-blue-500" /> {/* Icon for address */}
                            {user.address}
                            </p>
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)} // Start editing
                            className="flex items-center gap-1 text-red-500 border-red-500 hover:bg-red-50 transition-colors"
                            >
                            <PencilIcon className="h-3 w-3" /> {/* Edit icon */}
                            Edit
                            </Button>
                        </div>
                        </div>
                    ) : (
                        <Button
                        className="bg-red-500 hover:bg-red-600 text-white text-sm transition-colors flex items-center gap-1"
                        onClick={() => setIsEditing(true)}
                        >
                        <PlusCircleIcon className="h-4 w-4" /> {/* Add icon */}
                        Add Address
                        </Button>
                    )}
                    </CardContent>
                </Card>
            </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      You haven't placed any orders yet. Browse restaurants to place your first order.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8">
                    <Button className="bg-red-500 hover:bg-red-600" onClick={() => router.push("/dashboard")}>
                      Browse Restaurants
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      You haven't added any payment methods yet. Add a payment method to make checkout faster.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-8">
                    <Button className="bg-red-500 hover:bg-red-600">
                      <CreditCard className="mr-2 h-4 w-4" /> Add Payment Method
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

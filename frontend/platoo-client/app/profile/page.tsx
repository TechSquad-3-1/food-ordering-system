"use client"
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
import { useCart } from "@/hooks/useCart";

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
  // Use the useCart hook to get cart items and cart count
  const { cartItems } = useCart(); 
  const cartCount = cartItems.length; // Get the count of items in the cart

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

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

      if (!response.ok) {
        const errorText = await response.text(); // Capture raw HTML response
        console.error("Error:", errorText); // Log the error to inspect
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

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
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login"); // Redirect to login if an error occurs
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken"); // Remove token
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
  
    const userId = localStorage.getItem("userId"); // Get userId from localStorage
  
    if (!userId) {
      console.error("User ID not found");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/api/auth/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Capture raw HTML response
        console.error("Error:", errorText); // Log the error to inspect
        throw new Error("Failed to update user data");
      }
  
      const data = await response.json();
  
      // Update localStorage with new data
      localStorage.setItem("user", JSON.stringify(formData));
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
      <Header cartCount={cartCount} />

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/avatar.png?height=96&width=96" alt={user.name} />
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
                  <Link href="/orders/history" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                    <Clock className="mr-3 h-5 w-5" />
                    Order History
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

              {/* Other Tabs here... */}
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

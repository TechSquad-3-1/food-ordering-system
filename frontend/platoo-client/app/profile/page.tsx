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
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);
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
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear errors on input change
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" }); // Clear errors on input change
  };

  // Frontend validation before submitting, only validates fields of the active tab
  const validateForm = () => {
    let errors = { email: "", phone: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (activeTab === "personal") {
      // Email validation: should end with @gmail.com
      if (!formData.email) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
        errors.email = "Enter valid gmail address";
        isValid = false;
      }

      // Phone validation: should be exactly 10 digits
      if (!formData.phone) {
        errors.phone = "Phone number is required";
        isValid = false;
      } else if (!/^\d{10}$/.test(formData.phone)) {
        errors.phone = "Phone number should be 10 digits";
        isValid = false;
      }
    }

    if (activeTab === "password") {
      // Password validation: should be at least 8 characters long
      if (!passwordData.newPassword) {
        errors.password = "New password is required";
        isValid = false;
      } else if (passwordData.newPassword.length < 8) {
        errors.password = "Password should be at least 8 characters";
        isValid = false;
      }

      // Confirm password validation: should match the new password
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    if (activeTab === "addresses") {
      // No specific validation for address yet, but you can add it as needed
    }

    setFormErrors(errors); // Set error messages for the form
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return; // Prevent submitting if validation fails
    }

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validate password and confirm password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormErrors({
        ...formErrors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }
  
    if (passwordData.newPassword.length < 8) {
      setFormErrors({
        ...formErrors,
        password: "Password should be at least 8 characters",
      });
      return;
    }
  
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
        body: JSON.stringify({ newPassword: passwordData.newPassword }), // Send newPassword to update
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error:", errorText);
        throw new Error("Failed to update password");
      }
  
      const data = await response.json();
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
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
                <TabsTrigger value="personal" onClick={() => setActiveTab("personal")}>Personal Info</TabsTrigger>
                <TabsTrigger value="addresses" onClick={() => setActiveTab("addresses")}>Addresses</TabsTrigger>
                <TabsTrigger value="password" onClick={() => setActiveTab("password")}>Password</TabsTrigger>
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
                          {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                          {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
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

              {/* Password Tab */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="oldPassword" className="text-sm font-medium">Old Password</label>
                        <Input 
                          id="oldPassword"
                          name="oldPassword"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                        <Input 
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                        <Input 
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Change Password
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                      <MapPinIcon className="h-4 w-4 text-red-500" /> Delivery Addresses
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      {user?.address ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4 text-green-500" /> 
                          Your current address: <span className="font-medium">{user.address}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircleIcon className="h-4 w-4 text-yellow-500" /> 
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
                            <HomeIcon className="h-4 w-4 text-blue-500" /> 
                            {user.address}
                          </p>
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-1 text-red-500 border-red-500 hover:bg-red-50 transition-colors"
                          >
                            <PencilIcon className="h-3 w-3" /> 
                            Edit
                          </Button> */}
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white text-sm transition-colors flex items-center gap-1"
                        onClick={() => setIsEditing(true)}
                      >
                        <PlusCircleIcon className="h-4 w-4" /> 
                        Add Address
                      </Button>
                    )}
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

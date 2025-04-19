"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Loader2 } from "lucide-react";

export default function DeliveryPersonProfile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<{
    name: string;
    email: string;
    phone?: string;
    vehicleNumber?: string;
  } | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone?: string;
    vehicleNumber?: string;
  }>({
    name: "",
    email: "",
    phone: "",
    vehicleNumber: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    fetchUserProfile(token, userId);
  }, [router]);

  const fetchUserProfile = async (token: string, userId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:4000/api/auth/user/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          vehicleNumber: data.vehicleNumber,
        });
      } else {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:4000/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setUser(formData);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600">User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Delivery Person Profile</CardTitle>
            <CardDescription className="text-gray-500">Manage your personal details</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            {isEditing ? "Cancel" : (<><Edit className="h-4 w-4" /> Edit</>)}
          </Button>
        </CardHeader>

        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="h-28 w-28 shadow-md">
              <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
              <AvatarFallback className="bg-red-500 text-white">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6 bg-gray-50 p-6 rounded-xl">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
              <Input
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Vehicle */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Vehicle Number</label>
              <Input
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 transition-all duration-200 rounded-full px-6"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

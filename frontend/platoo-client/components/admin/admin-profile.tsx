import type React from "react";
import { useState, useEffect } from "react";
import { User, Mail, Shield, Calendar, Save, Camera, LogOut, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAdminSession } from "./admin-session";
import { useToast } from "@/components/ui/use-toast";

interface Admin {
  name: string;
  email: string;
  avatar: string;
  role: string;
  lastLogin: string;
  permissions: string[];
}

export default function AdminProfile() {
  const { admin, updateAdminProfile, logout } = useAdminSession();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
  });

  if (!admin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your admin profile information</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">Not logged in</h3>
            <p className="mt-1 text-sm text-muted-foreground">Please log in to view your profile</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateAdminProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>{isEditing ? "Edit your profile details" : "View your profile details"}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={admin?.avatar || ""} alt={admin?.name || "Admin"} />
                  <AvatarFallback className="text-xl">{admin?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button type="button" variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    className="pl-9"
                    value={isEditing ? formData.name : admin.name}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-9"
                    value={isEditing ? formData.email : admin.email}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="capitalize">
                    {admin.role.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Last Login</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{new Date(admin.lastLogin).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>Your admin access permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {admin.permissions.map((permission, index) => (
                  <Badge key={index} variant="secondary">
                    {permission}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Permission Details</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Users Management</span>
                    <Badge
                      variant="outline"
                      className={
                        admin.permissions.includes("users:write")
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }
                    >
                      {admin.permissions.includes("users:write")
                        ? "Full Access"
                        : admin.permissions.includes("users:read")
                          ? "Read Only"
                          : "No Access"}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Orders Management</span>
                    <Badge
                      variant="outline"
                      className={
                        admin.permissions.includes("orders:write")
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }
                    >
                      {admin.permissions.includes("orders:write")
                        ? "Full Access"
                        : admin.permissions.includes("orders:read")
                          ? "Read Only"
                          : "No Access"}
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Restaurants Management</span>
                    <Badge
                      variant="outline"
                      className={
                        admin.permissions.includes("restaurants:write")
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }
                    >
                      {admin.permissions.includes("restaurants:write")
                        ? "Full Access"
                        : admin.permissions.includes("restaurants:read")
                          ? "Read Only"
                          : "No Access"}
                    </Badge>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

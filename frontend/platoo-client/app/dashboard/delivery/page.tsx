"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Edit, MapPin, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  vehicleNumber?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export default function DeliveryPersonProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ name: "", email: "", phone: "", vehicleNumber: "" });
  const [searchValue, setSearchValue] = useState("");
  const [locationError, setLocationError] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("deliveryManId");
    if (!token || !userId) {
      router.push("/login");
      return;
    }
    fetchUserData(token, userId);
  }, []);

  const fetchUserData = async (token: string, userId: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehicleNumber: data.vehicleNumber,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (err) {
      console.error("Failed to fetch user data", err);
      router.push("/login");
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    const userId = localStorage.getItem("deliveryManId");
    try {
      await fetch(`http://localhost:4000/api/auth/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(formData),
      });
      setIsEditing(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleSaveLocation = async () => {
    const userId = localStorage.getItem("deliveryManId");
    try {
      await fetch(`http://localhost:4000/api/auth/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ address: formData.address, latitude: formData.latitude, longitude: formData.longitude }),
      });
      alert("Location updated successfully.");
    } catch (err) {
      console.error("Failed to update location", err);
    }
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    const defaultLatLng = [formData.latitude || 20.5937, formData.longitude || 78.9629];
    const mapInstance = window.L.map(mapRef.current).setView(defaultLatLng, 13);

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance);

    if (formData.latitude && formData.longitude) {
      const newMarker = window.L.marker(defaultLatLng, { draggable: true }).addTo(mapInstance);
      newMarker.on("dragend", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      });
      setMarker(newMarker);
    }

    mapInstance.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const newMarker = window.L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
        newMarker.on("dragend", (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
        });
        setMarker(newMarker);
      }
    });

    setMap(mapInstance);
  };

  const searchAddress = async () => {
    if (!searchValue.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setFormData((prev) => ({ ...prev, latitude: parseFloat(lat), longitude: parseFloat(lon), address: display_name }));
        if (map) {
          map.setView([lat, lon], 15);
          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            const newMarker = window.L.marker([lat, lon], { draggable: true }).addTo(map);
            setMarker(newMarker);
          }
        }
      } else {
        setLocationError("No results found.");
      }
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !map && mapRef.current) {
      if (!window.L) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => initializeMap();
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    }
  }, [mapRef, formData.latitude, formData.longitude]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">Loading profile...</div>
    );
  }

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
    { title: "Earnings", href: "/dashboard/delivery/earnings", icon: "dollar-sign" },
    { title: "Profile", href: "/dashboard/delivery", icon: "user" },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Profile Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          {/* Profile Info Part (fixed) */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Person Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                  disabled={!isEditing}
                />
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  disabled={!isEditing}
                />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone Number"
                  disabled={!isEditing}
                />
                <Input
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleProfileChange}
                  placeholder="Vehicle Number"
                  disabled={!isEditing}
                />
                {isEditing ? (
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Part (your latest version kept exactly) */}
          <TabsContent value="location">
            {/* Your location code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <MapPin className="h-5 w-5 text-red-500" /> Delivery Addresses
                </CardTitle>
                {formData.address && (
                  <CardDescription className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Your current address: {formData.address}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {locationError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2">
                  <Input placeholder="Search for an address..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                  <Button onClick={searchAddress}><Search className="h-4 w-4" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Latitude"
                    value={formData.latitude || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  />
                  <Input
                    placeholder="Longitude"
                    value={formData.longitude || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  />
                </div>
                <Button onClick={handleSaveLocation} className="w-full bg-red-500">Save Location</Button>
                <div ref={mapRef} className="w-full h-[400px] rounded-md border"></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

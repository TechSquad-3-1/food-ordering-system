// "use client";

// import { useState, useEffect } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";
// import { Loader2, MapPin, Phone, DollarSign, Clock, CheckCircle, TruckIcon, BarChart3, User, Calendar, MapIcon, Store } from "lucide-react";

// interface DeliveryDashboardProps {
//   userId: string;
// }

// interface DeliveryProfile {
//   name: string;
//   email: string;
//   phone: string;
//   vehicleNumber: string;
//   rating: number;
//   totalDeliveries: number;
//   totalEarnings: number;
// }

// interface Delivery {
//   id: string;
//   orderId: string;
//   customer: {
//     name: string;
//     address: string;
//     phone: string;
//   };
//   restaurant: {
//     name: string;
//     address: string;
//   };
//   status: "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
//   items: { name: string; quantity: number }[];
//   total: number;
//   estimatedDeliveryTime: string;
//   distance: string;
//   earnings: number;
//   date: string;
// }

// export default function DeliveryDashboard({ userId }: DeliveryDashboardProps) {
//   const [profile, setProfile] = useState<DeliveryProfile | null>(null);
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);

//   useEffect(() => {
//     const storedActiveOrder = localStorage.getItem("activeOrder");
//     if (storedActiveOrder) {
//       const parsedOrder = JSON.parse(storedActiveOrder);
//       const convertedOrder = {
//         id: parsedOrder.id,
//         orderId: parsedOrder.id,
//         customer: {
//           name: parsedOrder.customer.name,
//           address: parsedOrder.customer.address,
//           phone: "",
//         },
//         restaurant: {
//           name: "Restaurant Name",
//           address: "Restaurant Address",
//         },
//         status: "in_transit" as const,
//         items: parsedOrder.items.map((item: any) => ({
//           name: item.name,
//           quantity: item.quantity,
//         })),
//         total: parseFloat(parsedOrder.total),
//         estimatedDeliveryTime: "15 minutes",
//         distance: "2 miles",
//         earnings: 6.5,
//         date: new Date().toISOString(),
//       };
//       setActiveDelivery(convertedOrder);
//     }

//     setTimeout(() => {
//       setProfile({
//         name: "Alex Rodriguez",
//         email: "alex.r@example.com",
//         phone: "+1 (555) 987-6543",
//         vehicleNumber: "XYZ-789",
//         rating: 4.8,
//         totalDeliveries: 156,
//         totalEarnings: 1875.5,
//       });

//       setDeliveries([]); // No other deliveries needed for now
//       setIsLoading(false);
//     }, 1000);
//   }, [userId]);

//   const getStatusColor = (status: Delivery["status"]) => {
//     switch (status) {
//       case "assigned":
//         return "bg-yellow-500";
//       case "picked_up":
//         return "bg-blue-500";
//       case "in_transit":
//         return "bg-purple-500";
//       case "delivered":
//         return "bg-green-500";
//       case "cancelled":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getStatusText = (status: Delivery["status"]) => {
//     switch (status) {
//       case "assigned":
//         return "Assigned";
//       case "picked_up":
//         return "Picked Up";
//       case "in_transit":
//         return "In Transit";
//       case "delivered":
//         return "Delivered";
//       case "cancelled":
//         return "Cancelled";
//       default:
//         return "Unknown";
//     }
//   };

//   const navItems = [
//     { title: "Dashboard", href: "/dashboard", icon: "home" },
//     { title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
//     { title: "Pending_Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
//     { title: "Earnings", href: "/dashboard/earnings", icon: "dollar-sign" },
//     { title: "Profile", href: "/dashboard/delivery/profile", icon: "user" },
//     { title: "Settings", href: "/dashboard/settings", icon: "settings" },
//   ];

//   if (isLoading) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex h-full items-center justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
//           <span className="ml-2 text-lg">Loading your dashboard...</span>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout navItems={navItems}>
//       <div className="flex flex-col gap-6 p-4 md:p-8">
//         <div className="flex flex-col gap-2">
//           <h1 className="text-3xl font-bold tracking-tight">Welcome, {profile?.name}</h1>
//           <p className="text-muted-foreground">Manage your deliveries and track your earnings.</p>
//         </div>

//         {/* Earning Cards (keep same) */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">$0.00</div>
//               <p className="text-xs text-muted-foreground">From 0 deliveries today</p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
//               <TruckIcon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{profile?.totalDeliveries}</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Rating</CardTitle>
//               <BarChart3 className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{profile?.rating}/5.0</div>
//               <Progress value={profile?.rating ? (profile.rating / 5) * 100 : 0} className="mt-2" />
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
//               <DollarSign className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">${profile?.totalEarnings.toFixed(2)}</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Tabs */}
//         <Tabs defaultValue="active" className="space-y-4">
//           <TabsList>
//             <TabsTrigger value="active">Active Delivery</TabsTrigger>
//             <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//             <TabsTrigger value="profile">Profile</TabsTrigger>
//           </TabsList>

//           {/* THIS IS THE UPDATED ACTIVE DELIVERY TAB */}
//           <TabsContent value="active" className="space-y-4">
//             {activeDelivery ? (
//               <Card>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <CardTitle>Current Delivery</CardTitle>
//                     <Badge className={`${getStatusColor(activeDelivery.status)} text-white`}>
//                       {getStatusText(activeDelivery.status)}
//                     </Badge>
//                   </div>
//                   <CardDescription>
//                     Order #{activeDelivery.orderId} • {new Date(activeDelivery.date).toLocaleString()}
//                   </CardDescription>
//                 </CardHeader>

//                 <CardContent className="space-y-6">
//                   {/* Restaurant/Customer */}
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <h3 className="font-semibold">Restaurant</h3>
//                       <div className="flex items-start space-x-2">
//                         <Store className="mt-0.5 h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <div>{activeDelivery.restaurant.name}</div>
//                           <div className="text-sm text-muted-foreground">{activeDelivery.restaurant.address}</div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <h3 className="font-semibold">Customer</h3>
//                       <div className="flex items-start space-x-2">
//                         <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
//                         <div>
//                           <div>{activeDelivery.customer.name}</div>
//                           <div className="text-sm text-muted-foreground">{activeDelivery.customer.address}</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Details */}
//                   <div className="space-y-2">
//                     <h3 className="font-semibold">Order Details</h3>
//                     <div className="rounded-md border p-4">
//                       {activeDelivery.items.map((item, index) => (
//                         <div key={index} className="flex justify-between">
//                           <span>{item.quantity}x {item.name}</span>
//                         </div>
//                       ))}
//                       <div className="mt-4 flex justify-between border-t pt-2">
//                         <span className="font-medium">Total</span>
//                         <span className="font-bold">${activeDelivery.total.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Time/Distance/Earnings */}
//                   <div className="grid gap-4 md:grid-cols-3">
//                     <div className="flex flex-col items-center rounded-md border p-3">
//                       <Clock className="mb-1 h-5 w-5 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">Estimated Time</span>
//                       <span className="font-medium">{activeDelivery.estimatedDeliveryTime}</span>
//                     </div>
//                     <div className="flex flex-col items-center rounded-md border p-3">
//                       <MapPin className="mb-1 h-5 w-5 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">Distance</span>
//                       <span className="font-medium">{activeDelivery.distance}</span>
//                     </div>
//                     <div className="flex flex-col items-center rounded-md border p-3">
//                       <DollarSign className="mb-1 h-5 w-5 text-muted-foreground" />
//                       <span className="text-sm text-muted-foreground">Earnings</span>
//                       <span className="font-medium">${activeDelivery.earnings.toFixed(2)}</span>
//                     </div>
//                   </div>

//                   {/* Buttons */}
//                   <div className="flex justify-between space-x-2">
//                     <Button variant="outline" className="flex-1">
//                       <Phone className="mr-2 h-4 w-4" /> Call Customer
//                     </Button>
//                     <Button variant="outline" className="flex-1">
//                       <MapIcon className="mr-2 h-4 w-4" /> Navigation
//                     </Button>
//                     <Button
//                       className="flex-1 bg-green-600 hover:bg-green-700"
//                       onClick={async () => {
//                         try {
//                           const res = await fetch(`http://localhost:3008/api/orders/${activeDelivery.id}/status`, {
//                             method: "PATCH",
//                             headers: { "Content-Type": "application/json" },
//                             body: JSON.stringify({ status: "delivered" }),
//                           });

//                           if (res.ok) {
//                             alert("Delivery Completed!");
//                             localStorage.removeItem("activeOrder");
//                             setActiveDelivery(null);
//                           } else {
//                             alert("Failed to complete delivery.");
//                           }
//                         } catch (error) {
//                           console.error(error);
//                         }
//                       }}
//                     >
//                       <CheckCircle className="mr-2 h-4 w-4" /> Complete Delivery
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>No Active Deliveries</CardTitle>
//                   <CardDescription>
//                     You don't have any active deliveries at the moment.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col items-center justify-center py-8">
//                     <TruckIcon className="mb-4 h-16 w-16 text-muted-foreground" />
//                     <p className="text-center text-muted-foreground">
//                       Check back soon for new delivery assignments or view your upcoming deliveries.
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Upcoming, History, Profile tabs stay same */}
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle } from "lucide-react";

interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: {
    name: string;
    address: string;
  };
  total: number;
  restaurant_id: string;
  restaurantName: string;
  items: OrderItem[];
}

export default function DeliveryDashboard() {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [todayDeliveries, setTodayDeliveries] = useState(0);
  const [deliveryHistory, setDeliveryHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItemMap, setMenuItemMap] = useState<Record<string, string>>({});

  const driverId =
    typeof window !== "undefined"
      ? localStorage.getItem("deliveryManId") || "driver-123"
      : "driver-123";

  const fetchMenuItemMap = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/menu-items");
      const items = await res.json();
      const map: Record<string, string> = {};
      items.forEach((item: any) => {
        map[item._id] = item.name;
      });
      setMenuItemMap(map);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    }
  };

  const fetchActiveOrderWithDetails = async () => {
    const stored = localStorage.getItem("activeOrder");
    if (!stored) return;

    const parsedOrder = JSON.parse(stored);

    let restaurantName = "Unknown Restaurant";
    try {
      const res = await fetch(
        `http://localhost:3001/api/restaurants/${parsedOrder.restaurant_id}`
      );
      const data = await res.json();
      restaurantName = data.name || restaurantName;
    } catch {}

    setActiveOrder({ ...parsedOrder, restaurantName });
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3003/api/delivery/driver/${driverId}`);
      const data = await res.json();
      const done = data.filter((d: any) => d.deliveryStatus === "delivered");
      const today = new Date().toISOString().split("T")[0];
      const todayDone = done.filter((d: any) => d.deliveryTime.split("T")[0] === today);

      setTotalDeliveries(done.length);
      setTodayDeliveries(todayDone.length);
      setDeliveryHistory(done);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItemMap();
    fetchActiveOrderWithDetails();
    fetchHistory();
  }, [driverId]);

  const completeDelivery = async () => {
    if (!activeOrder) return;

    const payload = {
      orderId: activeOrder.id,
      customerName: activeOrder.customer.name,
      deliveryAddress: activeOrder.customer.address,
      restaurantName: activeOrder.restaurantName,
      restaurantId: activeOrder.restaurant_id,
      deliveryStatus: "delivered",
      pickupTime: new Date(),
      deliveryTime: new Date(),
      assignedTo: driverId,
      totalAmount: activeOrder.total,
      earnings: 300,
    };

    try {
      await fetch("http://localhost:3003/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await fetch(`http://localhost:3008/api/orders/${activeOrder.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      });

      localStorage.removeItem("activeOrder");
      setActiveOrder(null);
      setTotalDeliveries((prev) => prev + 1);
      setTodayDeliveries((prev) => prev + 1);
      fetchHistory(); // Refresh after delivery complete
    } catch (error) {
      console.error("Error completing delivery", error);
    }
  };

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    //{ title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
    {
      title: "Pending Deliveries",
      href: "/dashboard/delivery/pending-deliveries",
      icon: "truck",
    },
    { title: "Earnings", href: "/dashboard/delivery/earnings", icon: "dollar-sign" },
    { title: "Profile", href: "/dashboard/delivery", icon: "user" },
    //{ title: "Settings", href: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>LKR {(todayDeliveries * 300).toFixed(2)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>{totalDeliveries}</CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Delivery</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Active Delivery Tab */}
          <TabsContent value="active">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : activeOrder ? (
              <Card>
                <CardHeader>
                  <CardTitle>Active Delivery</CardTitle>
                  <Badge className="bg-yellow-600">In Progress</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>Restaurant: {activeOrder.restaurantName}</div>
                  <div>Customer: {activeOrder.customer.name}</div>
                  <div>Address: {activeOrder.customer.address}</div>
                  <div>
                    <strong>Items:</strong>
                    <ul className="list-disc list-inside">
                      {activeOrder.items.map((item, i) => (
                        <li key={i}>
                          {item.quantity}x {menuItemMap[item.menu_item_id] || "Unknown Item"} - LKR {item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    className="w-full mt-4 bg-green-600 text-white"
                    onClick={completeDelivery}
                  >
                    <CheckCircle className="mr-2" /> Complete Delivery
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Active Delivery</CardTitle>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          {/* Delivery History Tab with Refresh */}
          <TabsContent value="history">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Delivery History</CardTitle>
                <Button onClick={fetchHistory}>Refresh</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliveryHistory.length === 0 ? (
                  <p>No completed deliveries yet.</p>
                ) : (
                  deliveryHistory.map((delivery, i) => (
                    <div key={i} className="border-b pb-3">
                      <div>
                        <strong>Customer:</strong> {delivery.customerName}
                      </div>
                      <div>
                        <strong>Address:</strong> {delivery.deliveryAddress}
                      </div>
                      <div>
                        <strong>Restaurant:</strong> {delivery.restaurantName}
                      </div>
                      <div>
                        <strong>Status:</strong>{" "}
                        <Badge className="bg-green-600">{delivery.deliveryStatus}</Badge>
                      </div>
                      <div>
                        <strong>Delivered At:</strong>{" "}
                        {new Date(delivery.deliveryTime).toLocaleString()}
                      </div>
                      <div>
                        <strong>Earnings:</strong> LKR {delivery.earnings.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

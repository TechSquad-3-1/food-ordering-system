"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Clock, Download } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // ✅ new import

interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: { name: string; address: string };
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
  const [currentTime, setCurrentTime] = useState(new Date());

  const driverId =
    typeof window !== "undefined"
      ? localStorage.getItem("deliveryManId") || "driver-123"
      : "driver-123";

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      fetchHistory();
    } catch (error) {
      console.error("Error completing delivery", error);
    }
  };

  useEffect(() => {
    fetchMenuItemMap();
    fetchActiveOrderWithDetails();
    fetchHistory();
  }, [driverId]);

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
    { title: "Earnings", href: "/dashboard/delivery/earnings", icon: "dollar-sign" },
    { title: "Profile", href: "/dashboard/delivery", icon: "user" },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("Completed Deliveries Report", 10, 10);
    const tableData = deliveryHistory.map((d, index) => [
      index + 1,
      d.customerName,
      d.deliveryAddress,
      d.restaurantName,
      d.deliveryStatus,
      new Date(d.deliveryTime).toLocaleString(),
      `LKR ${d.earnings.toFixed(2)}`
    ]);
    autoTable(doc, {
      head: [["#", "Customer", "Address", "Restaurant", "Status", "Delivered At", "Earnings"]],
      body: tableData,
      startY: 20,
    });
    doc.save("completed-deliveries.pdf");
  };

  // 🚀 Prepare daily deliveries data for the chart
  const dailyDeliveriesData = deliveryHistory.reduce((acc: Record<string, number>, delivery) => {
    const date = new Date(delivery.deliveryTime).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(dailyDeliveriesData).map(([date, count]) => ({
    date,
    deliveries: count,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6 relative">

        {/* Clock at Top */}
        <div className="flex justify-end mb-4">
          <div className="flex flex-col items-end">
            <div className="flex items-center text-3xl font-bold text-gray-800">
              <Clock className="h-7 w-7 mr-2" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <span className="text-sm font-medium text-gray-500">{getGreeting()}</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader><CardTitle>Today's Earnings</CardTitle></CardHeader>
            <CardContent className="text-xl font-semibold">LKR {(todayDeliveries * 300).toFixed(2)}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Deliveries</CardTitle></CardHeader>
            <CardContent className="text-xl font-semibold">{totalDeliveries}</CardContent>
          </Card>
        </div>

        {/* 🚀 Daily Deliveries Chart */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily Deliveries Overview</CardTitle>
              <CardDescription>Deliveries completed per day</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="deliveries" stroke="#ef4444" fill="#fca5a5" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No deliveries to display.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Delivery</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          {/* Active Delivery */}
          <TabsContent value="active">
            {isLoading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : activeOrder ? (
              <Card>
                <CardHeader><CardTitle>Active Delivery</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div><strong>Restaurant:</strong> {activeOrder.restaurantName}</div>
                  <div><strong>Customer:</strong> {activeOrder.customer.name}</div>
                  <div><strong>Address:</strong> {activeOrder.customer.address}</div>
                  <div><strong>Items:</strong>
                    <ul className="list-disc list-inside">
                      {activeOrder.items.map((item, i) => (
                        <li key={i}>{item.quantity}x {menuItemMap[item.menu_item_id] || "Unknown Item"} - LKR {item.price}</li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full mt-4 bg-green-600 text-white" onClick={completeDelivery}>
                    <CheckCircle className="mr-2" /> Complete Delivery
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader><CardTitle>No Active Delivery</CardTitle></CardHeader>
              </Card>
            )}
          </TabsContent>

          {/* Delivery History */}
          <TabsContent value="history">
            <div className="flex justify-between mb-4">
              <Button onClick={fetchHistory} variant="outline" className="bg-orange-500 text-white hover:bg-orange-600">Refresh</Button>
              <Button onClick={downloadPdf} className="bg-green-700 text-white hover:bg-green-800">
                <Download className="mr-2" /> Download PDF
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryHistory.length === 0 ? (
                <p>No completed deliveries yet.</p>
              ) : (
                deliveryHistory.map((delivery, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <CardTitle className="text-lg">{delivery.customerName}</CardTitle>
                      <CardDescription className="text-xs">
                        Delivered on {new Date(delivery.deliveryTime).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div><strong>Address:</strong> {delivery.deliveryAddress}</div>
                      <div><strong>Restaurant:</strong> {delivery.restaurantName}</div>
                      <div><strong>Status:</strong> <Badge className="bg-green-600">{delivery.deliveryStatus}</Badge></div>
                      <div><strong>Earnings:</strong> LKR {delivery.earnings.toFixed(2)}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, MapPin, Navigation, CheckCircle } from "lucide-react";
// import dynamic from "next/dynamic";
// import { toast } from "sonner";

// const DeliveryMap = dynamic(() => import("@/components/DeliveryMap"), { ssr: false });

// interface ActiveOrder {
//   id: string;
//   customer: {
//     name: string;
//     address: string;
//     latitude: number;
//     longitude: number;
//   };
//   driverLocation: {
//     lat: number;
//     lng: number;
//   };
//   restaurantCoordinates: {
//     lat: number;
//     lng: number;
//   };
//   items: { menu_item_id: string; quantity: number; price: number }[];
//   restaurantName: string;
//   restaurant_id: string;
//   total: string;
// }

// export default function DeliveryDashboard() {
//   const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
//   const [pickupCompleted, setPickupCompleted] = useState(false);
//   const [deliveryHistory, setDeliveryHistory] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const driverId =
//     typeof window !== "undefined" ? localStorage.getItem("deliveryManId") || "driver-123" : "driver-123";

//   useEffect(() => {
//     const storedOrder = localStorage.getItem("activeOrder");
//     if (storedOrder) {
//       setActiveOrder(JSON.parse(storedOrder));
//     }
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await fetch(`http://localhost:3003/api/delivery/driver/${driverId}`);
//       const data = await res.json();
//       setDeliveryHistory(data);
//     } catch (error) {
//       console.error("Error fetching history", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePickup = () => {
//     setPickupCompleted(true);
//     toast.success("Picked up the order! Now navigate to customer.");
//   };

//   const completeDelivery = async () => {
//     if (!activeOrder) return;

//     const payload = {
//       orderId: activeOrder.id,
//       customerName: activeOrder.customer.name,
//       deliveryAddress: activeOrder.customer.address,
//       restaurantName: activeOrder.restaurantName,
//       restaurantId: activeOrder.restaurant_id,
//       deliveryStatus: "delivered",
//       pickupTime: new Date(),
//       deliveryTime: new Date(),
//       assignedTo: driverId,
//       totalAmount: activeOrder.total,
//       earnings: 300,
//     };

//     try {
//       await fetch("http://localhost:3003/api/delivery", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       await fetch(`http://localhost:3008/api/orders/${activeOrder.id}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: "delivered" }),
//       });

//       localStorage.removeItem("activeOrder");
//       setActiveOrder(null);
//       setPickupCompleted(false);
//       fetchHistory();
//       toast.success("Delivery completed successfully!");
//     } catch (error) {
//       console.error("Error completing delivery", error);
//       toast.error("Failed to complete delivery!");
//     }
//   };

//   const navItems = [
//     { title: "Dashboard", href: "/dashboard", icon: "home" },
//     { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
//     { title: "Earnings", href: "/dashboard/delivery/earnings", icon: "dollar-sign" },
//     { title: "Profile", href: "/dashboard/delivery", icon: "user" },
//   ];

//   return (
//     <DashboardLayout navItems={navItems}>
//       <div className="p-6">

//         <Tabs defaultValue="active">
//           <TabsList>
//             <TabsTrigger value="active">Active Delivery</TabsTrigger>
//             <TabsTrigger value="history">Delivery History</TabsTrigger>
//           </TabsList>

//           {/* Active Delivery Tab */}
//           <TabsContent value="active">
//             {isLoading ? (
//               <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
//             ) : activeOrder ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Active Delivery</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-6">

//                   {/* Delivery Info */}
//                   <div>
//                     <p><strong>Restaurant:</strong> {activeOrder.restaurantName}</p>
//                     <p><strong>Customer:</strong> {activeOrder.customer.name}</p>
//                     <p><strong>Address:</strong> {activeOrder.customer.address}</p>
//                   </div>

//                   {/* Map */}
//                   {activeOrder.driverLocation && activeOrder.restaurantCoordinates && activeOrder.customer ? (
//                     <DeliveryMap
//                       pickup={activeOrder.restaurantCoordinates}
//                       dropoff={{
//                         lat: activeOrder.customer.latitude,
//                         lng: activeOrder.customer.longitude,
//                       }}
//                       driver={activeOrder.driverLocation}
//                       showPickupRoute={!pickupCompleted}
//                       showDropoffRoute={pickupCompleted}
//                     />
//                   ) : (
//                     <div>Loading map...</div>
//                   )}

//                   {/* Buttons */}
//                   {!pickupCompleted ? (
//                     <Button className="w-full bg-blue-600" onClick={handlePickup}>
//                       <Navigation className="mr-2" /> Navigate to Restaurant
//                     </Button>
//                   ) : (
//                     <Button className="w-full bg-green-600" onClick={completeDelivery}>
//                       <CheckCircle className="mr-2" /> Complete Delivery
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card>
//                 <CardHeader><CardTitle>No Active Order</CardTitle></CardHeader>
//               </Card>
//             )}
//           </TabsContent>

//           {/* Delivery History */}
//           <TabsContent value="history">
//             <h2 className="text-xl font-bold mb-4">Completed Deliveries</h2>
//             {deliveryHistory.length === 0 ? (
//               <p>No deliveries yet.</p>
//             ) : (
//               deliveryHistory.map((d, index) => (
//                 <Card key={index} className="mb-4">
//                   <CardHeader>
//                     <CardTitle>{d.customerName}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p><MapPin className="inline w-4 h-4 mr-1" /> {d.deliveryAddress}</p>
//                     <Badge variant="outline" className="mt-2">{d.deliveryStatus}</Badge>
//                     <p className="mt-2 text-sm">Earned: LKR {d.earnings.toFixed(2)}</p>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </TabsContent>

//         </Tabs>
//       </div>
//     </DashboardLayout>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Clock, Download } from "lucide-react"; // ✅ Add Download icon
import jsPDF from "jspdf"; // ✅
import "jspdf-autotable"; // 
import autoTable from "jspdf-autotable"; // ✅ Correct way


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

  // 🚀 New function: download PDF
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

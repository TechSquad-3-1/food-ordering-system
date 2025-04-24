"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DeliveryRecord {
  deliveryTime: string;
  earnings: number;
}

export default function EarningsPage() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const [dailyBreakdown, setDailyBreakdown] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const driverId =
    typeof window !== "undefined"
      ? localStorage.getItem("deliveryManId") || "driver-123"
      : "driver-123";

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await fetch(`http://localhost:3003/api/delivery/driver/${driverId}`);
        const data = await res.json();

        const completed = data.filter((d: any) => d.deliveryStatus === "delivered");
        const total = completed.length;
        const earnings = completed.reduce((sum: number, d: DeliveryRecord) => sum + d.earnings, 0);

        const daily: Record<string, number> = {};
        completed.forEach((d: DeliveryRecord) => {
          const date = new Date(d.deliveryTime).toISOString().split("T")[0];
          daily[date] = (daily[date] || 0) + d.earnings;
        });

        setTotalDeliveries(total);
        setTotalEarnings(earnings);
        setDailyBreakdown(daily);
      } catch (error) {
        console.error("Failed to fetch earnings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [driverId]);

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    { title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
    { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
    { title: "Earnings", href: "/dashboard/delivery/earnings", icon: "dollar-sign" },
    { title: "Profile", href: "/dashboard/delivery/profile", icon: "user" },
    { title: "Settings", href: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Earnings Overview</h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 mr-2 text-orange-600" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Deliveries</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{totalDeliveries}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">${totalEarnings.toFixed(2)}</CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {Object.entries(dailyBreakdown).map(([date, amount]) => (
                    <li key={date}>
                      <span className="font-medium">{date}</span>: ${amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

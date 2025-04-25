"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  order_id: string;
  user_id: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  restaurant_id: string;
  delivery_fee: number;
  delivery_address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

function getDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateRange(start: Date, end: Date) {
  const range = [];
  let current = new Date(start);
  while (current <= end) {
    range.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return range;
}

export default function OrderHistoryPage() {
  // Get the logged-in owner's restaurant ID from localStorage
  const ownerId = localStorage.getItem("restaurantOwnerId");
  const [restaurants, setRestaurants] = useState<any[]>([]); // Restaurant data
  const [orders, setOrders] = useState<Order[]>([]); // Orders data
  const [isLoading, setIsLoading] = useState(true);
  const [dailyCounts, setDailyCounts] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [orderCount, setOrderCount] = useState(0);
  const [userOrderStats, setUserOrderStats] = useState<{ labels: string[]; data: number[]; topUsers: { email: string, count: number }[] }>({ labels: [], data: [], topUsers: [] });
  
  
  useEffect(() => {
    if (!ownerId) return; // Ensure we have an ownerId

    // Fetch the restaurant(s) by ownerId
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/restaurants/owner/${ownerId}`);
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        const data = await response.json();
        setRestaurants(data);  // Set the restaurant data
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [ownerId]);

  useEffect(() => {
    if (restaurants.length === 0) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Fetch orders for the restaurant(s) that belong to the owner
        const ordersData: Order[] = [];
        for (const restaurant of restaurants) {
          const response = await fetch(`http://localhost:3008/api/orders?restaurant_id=${restaurant._id}`);
          if (!response.ok) throw new Error("Failed to fetch orders");
          const data = await response.json();
          ordersData.push(...data);
        }

        // Filter orders based on restaurant_id
        const filteredOrders = ordersData.filter((order: Order) => restaurants.some((restaurant) => restaurant._id === order.restaurant_id));
        setOrders(filteredOrders);
        setOrderCount(filteredOrders.length);

        // Process order dates
        const dates = filteredOrders.map((order: Order) => new Date(order.createdAt));
        if (dates.length === 0) {
          setDailyCounts({ labels: [], data: [] });
          setUserOrderStats({ labels: [], data: [], topUsers: [] });
          return;
        }

        // Sort and generate daily counts
        dates.sort((a: { getTime: () => number }, b: { getTime: () => number }) => a.getTime() - b.getTime());
        const startDate = new Date(dates[0].toISOString().slice(0, 10));
        const endDate = new Date();

        const dateRange = getDateRange(startDate, endDate);
        const dateLabels = dateRange.map(getDateString);

        const counts: { [date: string]: number } = {};
        dateLabels.forEach(date => { counts[date] = 0 });
        filteredOrders.forEach((order: Order) => {
          const dateStr = getDateString(new Date(order.createdAt));
          if (counts[dateStr] !== undefined) counts[dateStr] += 1;
        });

        setDailyCounts({
          labels: dateLabels,
          data: dateLabels.map(date => counts[date]),
        });

        // User analytics: Count orders per user (by email)
        const userCounts: { [email: string]: number } = {};
        filteredOrders.forEach((order: Order) => {
          if (order.email) {
            userCounts[order.email] = (userCounts[order.email] || 0) + 1;
          }
        });
        const sortedUsers = Object.entries(userCounts)
          .sort((a, b) => b[1] - a[1]);
        const topUsers = sortedUsers.slice(0, 10).map(([email, count]) => ({ email, count }));
        setUserOrderStats({
          labels: topUsers.map(u => u.email),
          data: topUsers.map(u => u.count),
          topUsers: sortedUsers.slice(0, 5).map(([email, count]) => ({ email, count })),
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setOrderCount(0);
        setDailyCounts({ labels: [], data: [] });
        setUserOrderStats({ labels: [], data: [], topUsers: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [restaurants]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "ready":
        return "bg-purple-500";
      case "out_for_delivery":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Chart data for orders per day since first order
  const chartData = {
    labels: dailyCounts.labels,
    datasets: [
      {
        label: "Number of Orders",
        data: dailyCounts.data,
        backgroundColor: "#6366f1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Orders Placed Per Day (Since First Order)" },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15,
        }
      },
      y: { beginAtZero: true, precision: 0 },
    },
  };

  // Chart data for user analytics
  const userChartData = {
    labels: userOrderStats.labels,
    datasets: [
      {
        label: "Orders per User",
        data: userOrderStats.data,
        backgroundColor: "#34d399",
      },
    ],
  };

  const userChartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Top 10 Users by Orders" },
    },
    scales: {
      x: { beginAtZero: true, precision: 0 },
      y: {
        ticks: {
          autoSkip: false,
        }
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          All orders placed for this restaurant.
        </p>
        <div className="text-lg font-semibold mt-2">
          Total Orders: <span className="text-primary">{orderCount}</span>
        </div>
      </div>

      {/* FLEX CONTAINER for the two charts side by side */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <Card style={{ flex: 1, minWidth: 0, maxWidth: "50%" }}>
          <CardHeader>
            <CardTitle>Orders Per Day (Since First Order)</CardTitle>
            <CardDescription>
              Number of orders placed each day from your first order to today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyCounts.labels.length === 0 ? (
              <div>No orders to display.</div>
            ) : (
              <div style={{ width: "100%", minWidth: 0 }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card style={{ flex: 1, minWidth: 0, maxWidth: "50%" }}>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>
              Top users who placed the most orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userOrderStats.labels.length === 0 ? (
              <div>No user analytics to display.</div>
            ) : (
              <>
                <div style={{ width: "100%", minWidth: 0, marginBottom: 24 }}>
                  <Bar data={userChartData} options={userChartOptions} />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Top 5 Users</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Orders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrderStats.topUsers.map(user => (
                        <TableRow key={user.email}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            List of all orders for this restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : orders.length === 0 ? (
            <div>No orders found for this restaurant.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Delivery Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order._id}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>LKR{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{order.delivery_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

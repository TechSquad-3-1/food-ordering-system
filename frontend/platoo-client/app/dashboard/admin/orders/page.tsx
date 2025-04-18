"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Calendar,
  User,
  Store,
  Truck,
  FileText,
  Printer,
  MapPin,
} from "lucide-react";

// This matches your backend order format
interface Order {
  _id: string;
  order_id?: string;
  user_id: string;
  restaurant_id: string;
  items: {
    menu_item_id?: string;
    quantity: number;
    price: number;
    _id: string;
  }[];
  total_amount: number;
  status: string;
  delivery_fee: number;
  delivery_address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3008/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setOrders([]);
        setFilteredOrders([]);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, orders]);

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          (order.order_id || order._id).toLowerCase().includes(query) ||
          order.user_id.toLowerCase().includes(query) ||
          order.restaurant_id.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query) ||
          order.phone.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "preparing":
        return "bg-blue-500";
      case "ready":
        return "bg-purple-500";
      case "out_for_delivery":
        return "bg-indigo-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Order Management</h1>
        <p className="text-gray-600">Track and manage all orders across your platform</p>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Order ID, User ID, Restaurant ID, Email, Phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 font-semibold text-gray-700">Order ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">User ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Restaurant ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Items</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Total</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Delivery Address</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={idx % 2 === 0 ? "bg-white hover:bg-blue-50" : "bg-gray-50 hover:bg-blue-50"}
                >
                  <td className="px-4 py-3 font-mono">{order.order_id || order._id}</td>
                  <td className="px-4 py-3">{order.user_id}</td>
                  <td className="px-4 py-3">{order.restaurant_id}</td>
                  <td className="px-4 py-3">
                    {order.items
                      .map(
                        (item) =>
                          `#${item.menu_item_id || item._id} x${item.quantity} (${formatCurrency(item.price)})`
                      )
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(order.total_amount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.delivery_address}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.email}</td>
                  <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

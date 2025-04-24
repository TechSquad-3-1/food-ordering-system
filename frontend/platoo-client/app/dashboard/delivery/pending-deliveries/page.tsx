// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, Search, Filter } from "lucide-react"
// import { Input } from "@/components/ui/input"

// interface Order {
//   id: string
//   customer: {
//     name: string
//     address: string
//   }
//   items: { name: string; quantity: number; price: string }[]
//   total: string
//   status: string
//   time: string
//   payment: string
//   delivery: string
//   restaurant_id: string
// }

// export default function PendingDeliveriesPage() {
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
//   const router = useRouter()

//   const navItems = [
//     { title: "Dashboard", href: "/dashboard", icon: "home" },
//     { title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
//     { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
//     { title: "Earnings", href: "/dashboard/earnings", icon: "dollar-sign" },
//     { title: "Profile", href: "/dashboard/delivery", icon: "user" },
//     { title: "Settings", href: "/dashboard/settings", icon: "settings" },
//   ]

//   const fetchOrders = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const res = await fetch("http://localhost:3008/api/orders")
//       if (!res.ok) throw new Error("Failed to fetch orders")
//       const data = await res.json()

//       const mappedOrders: Order[] = data
//         .filter((order: any) => order.status === "ready")
//         .map((order: any) => ({
//           id: order.order_id,
//           customer: {
//             name: order.email?.split("@")[0] || "Customer",
//             address: order.delivery_address || "N/A",
//           },
//           items: order.items.map((item: any) => ({
//             name: item.menu_item_id || "Item",
//             quantity: item.quantity,
//             price: item.price.toFixed(2),
//           })),
//           total: order.total_amount.toFixed(2),
//           status: order.status,
//           time: new Date(order.createdAt).toLocaleString(),
//           payment: "Online",
//           delivery: "Delivery",
//           restaurant_id: order.restaurant_id,
//         }))

//       setOrders(mappedOrders)
//     } catch (err) {
//       setError((err as Error).message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setDebouncedSearchQuery(searchQuery)
//     }, 400)
//     return () => clearTimeout(timeoutId)
//   }, [searchQuery])

//   const filteredOrders = orders.filter((order) => {
//     if (debouncedSearchQuery) {
//       const query = debouncedSearchQuery.toLowerCase()
//       return (
//         order.id.toLowerCase().includes(query) ||
//         order.customer.name.toLowerCase().includes(query) ||
//         order.total.toLowerCase().includes(query)
//       )
//     }
//     return true
//   })

//   const handleAcceptDelivery = (order: Order) => {
//     localStorage.setItem("activeOrder", JSON.stringify(order))
//     router.push("/dashboard")
//   }

//   if (loading) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex h-full items-center justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
//           <span className="ml-2 text-lg">Loading pending deliveries...</span>
//         </div>
//       </DashboardLayout>
//     )
//   }

//   if (error) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex h-full items-center justify-center text-red-600">
//           <span>Error: {error}</span>
//         </div>
//       </DashboardLayout>
//     )
//   }

//   return (
//     <DashboardLayout navItems={navItems}>
//       <div className="space-y-8 p-4 sm:p-6 md:p-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Pending Deliveries</h1>
//             <p className="text-muted-foreground">Deliveries that are ready and waiting for pickup</p>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//             <div className="relative w-full sm:w-[300px]">
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search orders..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <Button variant="outline" size="icon">
//               <Filter className="h-4 w-4" />
//             </Button>
//             <Button variant="default" onClick={fetchOrders}>
//               Refresh
//             </Button>
//           </div>
//         </div>

//         <Card>
//           <CardHeader className="p-4">
//             <CardTitle>Pending Delivery List</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order ID</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredOrders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell className="font-medium">{order.id}</TableCell>
//                     <TableCell>{order.customer.name}</TableCell>
//                     <TableCell>${order.total}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="bg-green-100 text-green-800">
//                         Ready
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{order.time}</TableCell>
//                     <TableCell>{order.payment}</TableCell>
//                     <TableCell className="text-right">
//                       <Button onClick={() => handleAcceptDelivery(order)}>
//                         Accept Delivery
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {filteredOrders.length === 0 && (
//           <div className="text-center text-muted-foreground py-20">
//             No pending deliveries available right now.
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   )
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, Search, Filter } from "lucide-react";
// import { Input } from "@/components/ui/input";

// interface Order {
//   id: string;
//   customer: {
//     name: string;
//     address: string;
//   };
//   items: { name: string; quantity: number; price: string }[];
//   total: string;
//   status: string;
//   time: string;
//   payment: string;
//   delivery: string;
//   restaurant_id: string;
// }

// export default function PendingDeliveriesPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
//   const router = useRouter();

//   const driverId = typeof window !== "undefined" ? localStorage.getItem("userId") || "driver-123" : "driver-123";

//   const navItems = [
//     { title: "Dashboard", href: "/dashboard", icon: "home" },
//     { title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
//     { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
//     { title: "Earnings", href: "/dashboard/earnings", icon: "dollar-sign" },
//     { title: "Profile", href: "/dashboard/delivery/profile", icon: "user" },
//     { title: "Settings", href: "/dashboard/settings", icon: "settings" },
//   ];

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("http://localhost:3008/api/orders");
//       if (!res.ok) throw new Error("Failed to fetch orders");
//       const data = await res.json();

//       const mappedOrders: Order[] = data
//         .filter((order: any) => order.status === "ready")
//         .map((order: any) => ({
//           id: order.order_id,
//           customer: {
//             name: order.email?.split("@")[0] || "Customer",
//             address: order.delivery_address || "N/A",
//           },
//           items: order.items.map((item: any) => ({
//             name: item.menu_item_id || "Item",
//             quantity: item.quantity,
//             price: item.price.toFixed(2),
//           })),
//           total: order.total_amount.toFixed(2),
//           status: order.status,
//           time: new Date(order.createdAt).toLocaleString(),
//           payment: "Online",
//           delivery: "Delivery",
//           restaurant_id: order.restaurant_id,
//         }));

//       setOrders(mappedOrders);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       setDebouncedSearchQuery(searchQuery);
//     }, 400);
//     return () => clearTimeout(timeoutId);
//   }, [searchQuery]);

//   const filteredOrders = orders.filter((order) => {
//     if (debouncedSearchQuery) {
//       const query = debouncedSearchQuery.toLowerCase();
//       return (
//         order.id.toLowerCase().includes(query) ||
//         order.customer.name.toLowerCase().includes(query) ||
//         order.total.toLowerCase().includes(query)
//       );
//     }
//     return true;
//   });

//   const handleAcceptDelivery = async (order: Order) => {
//     try {
//       const deliveryData = {
//         orderId: order.id,
//         customerName: order.customer.name,
//         deliveryAddress: order.customer.address,
//         restaurantName: "Restaurant XYZ", // 👉 (Optional) You can improve this to fetch real restaurant name
//         deliveryStatus: "assigned",
//         pickupTime: new Date(),
//         deliveryTime: new Date(Date.now() + 30 * 60 * 1000), // +30 mins
//         assignedTo: driverId,
//         earnings: 5, // Default per order earnings
//       };

//       const createDeliveryRes = await fetch("http://localhost:3003/api/delivery", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(deliveryData),
//       });

//       if (!createDeliveryRes.ok) throw new Error("Failed to create delivery record");

//       // ✅ Redirect to dashboard
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Error accepting delivery:", error);
//       alert("Something went wrong while accepting the delivery.");
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex h-full items-center justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
//           <span className="ml-2 text-lg">Loading pending deliveries...</span>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex h-full items-center justify-center text-red-600">
//           <span>Error: {error}</span>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout navItems={navItems}>
//       <div className="space-y-8 p-4 sm:p-6 md:p-8">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Pending Deliveries</h1>
//             <p className="text-muted-foreground">Deliveries that are ready and waiting for pickup</p>
//           </div>

//           <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
//             <div className="relative w-full sm:w-[300px]">
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search orders..."
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <Button variant="outline" size="icon">
//               <Filter className="h-4 w-4" />
//             </Button>
//             <Button variant="default" onClick={fetchOrders}>
//               Refresh
//             </Button>
//           </div>
//         </div>

//         <Card>
//           <CardHeader className="p-4">
//             <CardTitle>Pending Delivery List</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Order ID</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Time</TableHead>
//                   <TableHead>Payment</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredOrders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell>{order.id}</TableCell>
//                     <TableCell>{order.customer.name}</TableCell>
//                     <TableCell>${order.total}</TableCell>
//                     <TableCell>
//                       <Badge variant="outline" className="bg-green-100 text-green-800">
//                         Ready
//                       </Badge>
//                     </TableCell>
//                     <TableCell>{order.time}</TableCell>
//                     <TableCell>{order.payment}</TableCell>
//                     <TableCell className="text-right">
//                       <Button onClick={() => handleAcceptDelivery(order)}>Accept Delivery</Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </CardContent>
//         </Card>

//         {filteredOrders.length === 0 && (
//           <div className="text-center text-muted-foreground py-20">
//             No pending deliveries available right now.
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }




// ✅ Optimized Pending Deliveries Page
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  customer: { name: string; address: string };
  items: { menu_item_id: string; quantity: number; price: number }[];
  total: string;
  status: string;
  time: string;
  payment: string;
  delivery: string;
  restaurant_id: string;
  restaurantName: string;
}

export default function PendingDeliveriesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [menuItemMap, setMenuItemMap] = useState<Record<string, string>>({});
  const router = useRouter();

  const driverId =
    typeof window !== "undefined" ? localStorage.getItem("deliveryManId") || "driver-123" : "driver-123";

  const fetchMenuItems = async () => {
    const res = await fetch("http://localhost:3001/api/menu-items");
    const items = await res.json();
    const map: Record<string, string> = {};
    items.forEach((item: any) => (map[item._id] = item.name));
    return map;
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, menuMap] = await Promise.all([
        fetch("http://localhost:3008/api/orders"),
        fetchMenuItems(),
      ]);

      const data = await ordersRes.json();
      setMenuItemMap(menuMap);

      const readyOrders = data.filter((o: any) => o.status === "ready");

      const mapped = await Promise.all(
        readyOrders.map(async (o: any) => {
          const restRes = await fetch(`http://localhost:3001/api/restaurants/${o.restaurant_id}`);
          const rest = await restRes.json();

          return {
            id: o.order_id,
            customer: {
              name: o.email?.split("@")[0] || "Customer",
              address: o.delivery_address || "N/A",
            },
            items: o.items,
            total: o.total_amount.toFixed(2),
            status: o.status,
            time: new Date(o.createdAt).toLocaleString(),
            payment: "Online",
            delivery: "Delivery",
            restaurant_id: o.restaurant_id,
            restaurantName: rest.name || "Unknown Restaurant",
          };
        })
      );

      setOrders(mapped);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAcceptDelivery = (order: Order) => {
    localStorage.setItem("activeOrder", JSON.stringify(order));
    router.push("/dashboard");
  };

  const toggleRow = (id: string) => setExpandedRow((prev) => (prev === id ? null : id));

  const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: "home" },
    //{ title: "Deliveries", href: "/dashboard/deliveries", icon: "truck" },
    { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
    { title: "Earnings", href: "/dashboard/delivery/earnings", icon: "dollar-sign" },
    { title: "Profile", href: "/dashboard/delivery", icon: "user" },
    //{ title: "Settings", href: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pending Deliveries</h1>
          <Button variant="default" onClick={fetchOrders}>
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <Card>
            <CardHeader><CardTitle>Ready Orders</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <>
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{order.restaurantName}</TableCell>
                        <TableCell>LKR {order.total}</TableCell>
                        <TableCell>{order.time}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" onClick={() => toggleRow(order.id)}>
                            {expandedRow === order.id ? "Hide Items" : "View Items"}
                          </Button>
                          <Button onClick={() => handleAcceptDelivery(order)}>Accept</Button>
                        </TableCell>
                      </TableRow>
                      {expandedRow === order.id && (
                        <TableRow key={`${order.id}-items`}>
                          <TableCell colSpan={6}>
                            <ul className="list-disc list-inside">
                              {order.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.quantity}x {menuItemMap[item.menu_item_id] || "Unknown Item"} – LKR {item.price.toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Edit, Loader2 } from "lucide-react";
// import { DashboardLayout } from "@/components/layout/dashboard-layout";

// export default function DeliveryPersonProfile() {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const [user, setUser] = useState<{
//     name: string;
//     email: string;
//     phone?: string;
//     vehicleNumber?: string;
//   } | null>(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     vehicleNumber: "",
//   });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     if (token && userId) {
//       fetchUserProfile(token, userId);
//     } else {
//       router.push("/login");
//     }
//   }, [router]);

//   const fetchUserProfile = async (token: string, userId: string) => {
//     try {
//       setIsLoading(true);
//       const res = await fetch(`http://localhost:4000/api/auth/user/${userId}`, {
//         method: "GET",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setUser(data);
//         setFormData({
//           name: data.name,
//           email: data.email,
//           phone: data.phone || "",
//           vehicleNumber: data.vehicleNumber || "",
//         });
//       } else {
//         localStorage.removeItem("token");
//         router.push("/login");
//       }
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await fetch("http://localhost:4000/api/auth/update", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(formData),
//       });

//       if (res.ok) {
//         setUser(formData);
//         setIsEditing(false);
//       } else {
//         console.error("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   const navItems = [
//     { title: "Dashboard", href: "/dashboard", icon: "home" },
//     { title: "Pending Deliveries", href: "/dashboard/delivery/pending-deliveries", icon: "truck" },
//     { title: "Earnings", href: "/dashboard/earnings", icon: "dollar-sign" },
//     { title: "Profile", href: "/dashboard/profile", icon: "user" },
//   ];

//   if (isLoading) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex h-full items-center justify-center">
//           <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
//           <span className="ml-2 text-lg">Loading your profile...</span>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!user) {
//     return (
//       <DashboardLayout navItems={navItems}>
//         <div className="flex justify-center items-center min-h-screen">
//           <p className="text-gray-600">User not found.</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout navItems={navItems}>
//       <div className="min-h-screen p-6 md:p-10 bg-gray-50 flex items-center justify-center">
//         <div className="w-full max-w-5xl">
//           <Card className="shadow-lg rounded-2xl">
//             <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div>
//                 <CardTitle className="text-3xl font-bold">Delivery Person Profile</CardTitle>
//                 <CardDescription className="text-gray-500">Manage your personal details</CardDescription>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setIsEditing(!isEditing)}
//                 className="flex items-center gap-2"
//               >
//                 {isEditing ? "Cancel" : (<><Edit className="h-4 w-4" /> Edit</>)}
//               </Button>
//             </CardHeader>

//             <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
//               <div className="flex flex-col items-center md:items-start gap-4">
//                 <Avatar className="h-32 w-32">
//                   <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
//                   <AvatarFallback className="bg-primary text-white text-4xl">{user.name.charAt(0)}</AvatarFallback>
//                 </Avatar>
//                 <div className="text-center md:text-left">
//                   <h2 className="text-2xl font-semibold">{user.name}</h2>
//                   <p className="text-gray-500">{user.email}</p>
//                 </div>
//               </div>

//               <form onSubmit={handleSave} className="space-y-6">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                   <Input
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Email Address</label>
//                   <Input
//                     name="email"
//                     value={formData.email}
//                     disabled
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//                   <Input
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
//                   <Input
//                     name="vehicleNumber"
//                     value={formData.vehicleNumber}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                   />
//                 </div>

//                 {isEditing && (
//                   <div className="flex justify-end">
//                     <Button type="submit" className="rounded-full px-6 bg-green-600 hover:bg-green-700">
//                       Save Changes
//                     </Button>
//                   </div>
//                 )}
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

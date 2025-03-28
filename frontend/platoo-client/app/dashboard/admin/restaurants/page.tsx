import { AdminAuthGuard } from "@/components/admin/admin-session"
import { RestaurantList } from "@/components/admin/restaurant-list"

export default function RestaurantsPage() {
  return (
    <AdminAuthGuard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Restaurants Management</h1>
        <RestaurantList />
      </div>
    </AdminAuthGuard>
  )
}


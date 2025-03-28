import { AdminAuthGuard } from "@/components/admin/admin-session"
import OrderDetails from "@/components/admin/order-details"

export default function OrderDetailsPage() {
  return (
    <AdminAuthGuard>
      <OrderDetails />
    </AdminAuthGuard>
  )
}


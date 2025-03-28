import { AdminAuthGuard } from "@/components/admin/admin-session"
import DeliveryDetails from "@/components/admin/delivery-details"

export default function DeliveryDetailsPage() {
  return (
    <AdminAuthGuard>
      <DeliveryDetails />
    </AdminAuthGuard>
  )
}


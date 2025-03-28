import { AdminAuthGuard } from "@/components/admin/admin-session"
import UserDetails from "@/components/admin/user-details"

export default function UserDetailsPage() {
  return (
    <AdminAuthGuard>
      <UserDetails />
    </AdminAuthGuard>
  )
}


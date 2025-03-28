import { AdminAuthGuard } from "@/components/admin/admin-session"
import { ActivitySettings } from "@/components/admin/activity-settings"

export default function UserActivityPage() {
  return (
    <AdminAuthGuard>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Activity Settings</h1>
        <ActivitySettings userId="user-123" userType="customer" />
      </div>
    </AdminAuthGuard>
  )
}


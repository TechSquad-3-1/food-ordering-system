"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface ActivitySettingsProps {
  userId: string
  userType: "customer" | "restaurant_owner" | "delivery_person" | "admin"
}

export function ActivitySettings({ userId, userType }: ActivitySettingsProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    emailFrequency: "immediate",
    activityTracking: true,
    orderUpdates: true,
    marketingEmails: false,
    loginAlerts: true,
    timezone: "America/New_York",
  })

  // Additional settings based on user type
  const [restaurantOwnerSettings] = useState({
    menuChanges: true,
    orderNotifications: "all",
    reviewAlerts: true,
  })

  const [deliveryPersonSettings] = useState({
    locationTracking: true,
    availabilityUpdates: true,
    deliveryAssignmentMethod: "manual",
  })

  const handleSwitchChange = (section: keyof typeof settings, field: string, checked: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, boolean>), // Explicitly assert type
        [field]: checked,
      },
    }));
  };
  
      
  // Move handleValueChange OUTSIDE of handleSwitchChange
const handleValueChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
      
 

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // In a real app, you would call your API
      // await fetch(`/api/users/${userId}/settings`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings saved",
        description: "Your activity settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Control how and when you receive notifications about your account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Methods</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "email", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "push", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) => handleSwitchChange("notifications", "sms", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Email Frequency</h3>
            <RadioGroup
              value={settings.emailFrequency}
              onValueChange={(value) => handleValueChange("emailFrequency", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate">Immediate - Send emails as events happen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily Digest - Group notifications into a daily email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly Summary - Send a weekly summary of activity</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Timezone Settings</h3>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Your Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleValueChange("timezone", value)}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All times and dates will be displayed in your local timezone
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Tracking</CardTitle>
          <CardDescription>Manage how your activity is tracked and used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="activity-tracking" className="block">
                  Activity Tracking
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Allow us to track your activity to provide personalized recommendations
                </p>
              </div>
              <Switch
                id="activity-tracking"
                checked={settings.activityTracking}
                onCheckedChange={(checked) => handleValueChange("activityTracking", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="order-updates" className="block">
                  Order Updates
                </Label>
                <p className="text-sm text-muted-foreground mt-1">Receive updates about your orders and deliveries</p>
              </div>
              <Switch
                id="order-updates"
                checked={settings.orderUpdates}
                onCheckedChange={(checked) => handleValueChange("orderUpdates", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails" className="block">
                  Marketing Emails
                </Label>
                <p className="text-sm text-muted-foreground mt-1">Receive promotional emails and special offers</p>
              </div>
              <Switch
                id="marketing-emails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) => handleValueChange("marketingEmails", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="login-alerts" className="block">
                  Login Alerts
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive alerts when your account is accessed from a new device
                </p>
              </div>
              <Switch
                id="login-alerts"
                checked={settings.loginAlerts}
                onCheckedChange={(checked) => handleValueChange("loginAlerts", checked)}
              />
            </div>
          </div>

          {userType === "restaurant_owner" && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Restaurant Owner Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="menu-changes" className="block">
                      Menu Change Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Receive alerts when your menu is updated by staff
                    </p>
                  </div>
                  <Switch id="menu-changes" checked={restaurantOwnerSettings.menuChanges} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order-notifications">Order Notifications</Label>
                  <Select defaultValue={restaurantOwnerSettings.orderNotifications}>
                    <SelectTrigger id="order-notifications">
                      <SelectValue placeholder="Select notification level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="large">Large Orders Only</SelectItem>
                      <SelectItem value="special">Special Orders Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="review-alerts" className="block">
                      Review Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Get notified when customers leave reviews</p>
                  </div>
                  <Switch id="review-alerts" checked={restaurantOwnerSettings.reviewAlerts} />
                </div>
              </div>
            </>
          )}

          {userType === "delivery_person" && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Delivery Person Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location-tracking" className="block">
                      Location Tracking
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Allow tracking of your location during delivery hours
                    </p>
                  </div>
                  <Switch id="location-tracking" checked={deliveryPersonSettings.locationTracking} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="availability-updates" className="block">
                      Availability Updates
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Send automatic updates about your availability status
                    </p>
                  </div>
                  <Switch id="availability-updates" checked={deliveryPersonSettings.availabilityUpdates} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignment-method">Delivery Assignment Method</Label>
                  <Select defaultValue={deliveryPersonSettings.deliveryAssignmentMethod}>
                    <SelectTrigger id="assignment-method">
                      <SelectValue placeholder="Select assignment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automatic">Automatic Assignment</SelectItem>
                      <SelectItem value="manual">Manual Acceptance</SelectItem>
                      <SelectItem value="radius">Based on Proximity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-4">
            <Button variant="outline" className="sm:w-auto w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSaving} className="sm:w-auto w-full">
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


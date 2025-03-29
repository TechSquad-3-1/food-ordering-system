import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Globe, Camera, Save, CreditCard, Bell } from "lucide-react"

export default function RestaurantSettings() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant profile, business hours, and account settings.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Profile</CardTitle>
              <CardDescription>Update your restaurant information visible to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:items-start sm:justify-start sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Restaurant Logo" />
                  <AvatarFallback>PR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Restaurant Logo</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your profile and in search results.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Logo
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input id="restaurant-name" defaultValue="Platoo Restaurant" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine-type">Cuisine Type</Label>
                  <Select defaultValue="indian">
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Restaurant Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Authentic Indian cuisine with a modern twist. We specialize in flavorful biryanis, rich curries, and freshly baked bread from our tandoor oven."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <Phone className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                    <Input id="email" defaultValue="contact@platoorestaurant.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                  <Globe className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                  <Input id="website" defaultValue="https://platoorestaurant.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Restaurant Address</Label>
                <div className="flex">
                  <MapPin className="mr-2 h-4 w-4 self-center text-muted-foreground" />
                  <Input id="address" defaultValue="123 Food Street, Culinary District, NY 10001" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Restaurant Features</Label>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="dine-in" defaultChecked />
                    <Label htmlFor="dine-in">Dine-in</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="takeout" defaultChecked />
                    <Label htmlFor="takeout">Takeout</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="delivery" defaultChecked />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="vegetarian" defaultChecked />
                    <Label htmlFor="vegetarian">Vegetarian Options</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="vegan" />
                    <Label htmlFor="vegan">Vegan Options</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="gluten-free" />
                    <Label htmlFor="gluten-free">Gluten-Free Options</Label>
                    />
                    <Label htmlFor="gluten-free">Gluten-Free Options</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restaurant Images</CardTitle>
              <CardDescription>Upload photos of your restaurant, food, and ambiance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-md border">
                    <img
                      src={`/placeholder.svg?height=150&width=150&text=Image+${i}`}
                      alt={`Restaurant image ${i}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity hover:bg-black/50 hover:opacity-100">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
                  <Button variant="ghost" className="h-full w-full flex-col">
                    <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Image</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your restaurant's operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id={`open-${day.toLowerCase()}`} defaultChecked={day !== "Sunday"} />
                      <Label htmlFor={`open-${day.toLowerCase()}`} className="w-24 font-medium">
                        {day}
                      </Label>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <Label className="w-16 text-sm text-muted-foreground">Opening</Label>
                        <Select defaultValue={day !== "Sunday" ? "10:00" : ""}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={`${i}:00`}>
                                {i === 0
                                  ? "12:00 AM"
                                  : i < 12
                                    ? `${i}:00 AM`
                                    : i === 12
                                      ? "12:00 PM"
                                      : `${i - 12}:00 PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="w-16 text-sm text-muted-foreground">Closing</Label>
                        <Select defaultValue={day !== "Sunday" ? "22:00" : ""}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={`${i}:00`}>
                                {i === 0
                                  ? "12:00 AM"
                                  : i < 12
                                    ? `${i}:00 AM`
                                    : i === 12
                                      ? "12:00 PM"
                                      : `${i - 12}:00 PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Add Break
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch id="special-hours" />
                <Label htmlFor="special-hours">Set Special Hours for Holidays</Label>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Hours
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>Configure your delivery options and service area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="delivery-radius">Delivery Radius</Label>
                    <p className="text-sm text-muted-foreground">Maximum distance for delivery orders</p>
                  </div>
                  <div className="flex w-[180px] items-center">
                    <Input id="delivery-radius" type="number" defaultValue="5" className="mr-2" />
                    <span>miles</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="min-order">Minimum Order Amount</Label>
                    <p className="text-sm text-muted-foreground">Minimum order value for delivery</p>
                  </div>
                  <div className="flex w-[180px] items-center">
                    <span className="mr-2">$</span>
                    <Input id="min-order" type="number" defaultValue="15" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="delivery-fee">Delivery Fee</Label>
                    <p className="text-sm text-muted-foreground">Fee charged for delivery service</p>
                  </div>
                  <div className="flex w-[180px] items-center">
                    <span className="mr-2">$</span>
                    <Input id="delivery-fee" type="number" defaultValue="3.99" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Free Delivery Threshold</Label>
                    <p className="text-sm text-muted-foreground">Order amount for free delivery</p>
                  </div>
                  <div className="flex w-[180px] items-center">
                    <span className="mr-2">$</span>
                    <Input type="number" defaultValue="35" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Estimated Delivery Time</Label>
                    <p className="text-sm text-muted-foreground">Average time to deliver orders</p>
                  </div>
                  <div className="flex w-[180px] items-center gap-2">
                    <Input type="number" defaultValue="30" className="w-20" />
                    <span>to</span>
                    <Input type="number" defaultValue="45" className="w-20" />
                    <span>mins</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure payment options for your restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="credit-card" defaultChecked />
                  <Label htmlFor="credit-card">Accept Credit Cards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="debit-card" defaultChecked />
                  <Label htmlFor="debit-card">Accept Debit Cards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="cash" defaultChecked />
                  <Label htmlFor="cash">Accept Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="digital-wallet" defaultChecked />
                  <Label htmlFor="digital-wallet">Accept Digital Wallets</Label>
                </div>

                <Separator />

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="text-sm font-medium">Payment Account</h3>
                        <p className="text-xs text-muted-foreground">Connected to Stripe</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-500">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      Manage Account
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="text-sm font-medium">Tax Settings</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tax-rate">Sales Tax Rate</Label>
                      <div className="flex w-[100px] items-center">
                        <Input id="tax-rate" type="number" defaultValue="8.875" className="mr-2" />
                        <span>%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="include-tax" defaultChecked />
                      <Label htmlFor="include-tax">Include tax in displayed prices</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payout Information</CardTitle>
              <CardDescription>Manage your payout schedule and bank details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Payout Schedule</h3>
                    <p className="text-xs text-muted-foreground">When you receive your earnings</p>
                  </div>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="rounded-md border p-4">
                  <h3 className="text-sm font-medium">Bank Account</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Bank:</span> National Bank
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Account:</span> ****6789
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications about your restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Order Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="new-order">New Order Received</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="new-order-email" defaultChecked />
                        <Label htmlFor="new-order-email" className="text-sm">
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="new-order-sms" defaultChecked />
                        <Label htmlFor="new-order-sms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="new-order-app" defaultChecked />
                        <Label htmlFor="new-order-app" className="text-sm">
                          App
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="order-cancelled">Order Cancelled</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="order-cancelled-email" defaultChecked />
                        <Label htmlFor="order-cancelled-email" className="text-sm">
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="order-cancelled-sms" defaultChecked />
                        <Label htmlFor="order-cancelled-sms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="order-cancelled-app" defaultChecked />
                        <Label htmlFor="order-cancelled-app" className="text-sm">
                          App
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <h3 className="text-sm font-medium">Review Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="new-review">New Review</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="new-review-email" defaultChecked />
                        <Label htmlFor="new-review-email" className="text-sm">
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="new-review-sms" />
                        <Label htmlFor="new-review-sms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="new-review-app" defaultChecked />
                        <Label htmlFor="new-review-app" className="text-sm">
                          App
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <h3 className="text-sm font-medium">Financial Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="payout">Payout Processed</Label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="payout-email" defaultChecked />
                        <Label htmlFor="payout-email" className="text-sm">
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="payout-sms" />
                        <Label htmlFor="payout-sms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="payout-app" defaultChecked />
                        <Label htmlFor="payout-app" className="text-sm">
                          App
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Change Password</h3>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button className="mt-2">Update Password</Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Login Sessions</h3>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">New York, USA • Chrome on Windows</p>
                    </div>
                    <Badge>Active Now</Badge>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Mobile App</p>
                      <p className="text-xs text-muted-foreground">New York, USA • iPhone 13</p>
                    </div>
                    <Badge variant="outline">3 days ago</Badge>
                  </div>
                </div>
                <Button variant="outline" className="mt-2">
                  Sign Out All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground">Download a copy of your restaurant data</p>
                <div className="flex gap-2">
                  <Button variant="outline">Export Order History</Button>
                  <Button variant="outline">Export Customer Data</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your restaurant account and all associated data
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


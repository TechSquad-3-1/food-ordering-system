"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CreditCard, MapPin, Clock, AlertCircle, Plus } from "lucide-react"

interface CartItem {
  id: string
  menuItemId: string
  name: string
  price: number
  quantity: number
}

interface Address {
  id: string
  type: string
  address: string
  city: string
  state: string
  zip: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: string
  last4: string
  expiry: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [deliveryTime, setDeliveryTime] = useState<string>("asap")

  const [newAddress, setNewAddress] = useState({
    type: "Home",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  const [newPayment, setNewPayment] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      // Redirect to restaurants if cart is empty
      router.push("/restaurants")
    }

    // In a real app, fetch addresses and payment methods from API
    // For demo purposes, we'll use mock data
    const mockAddresses: Address[] = [
      {
        id: "addr1",
        type: "Home",
        address: "123 Main Street, Apt 4B",
        city: "Washington",
        state: "DC",
        zip: "20001",
        isDefault: true,
      },
      {
        id: "addr2",
        type: "Work",
        address: "456 Office Plaza, Suite 200",
        city: "Washington",
        state: "DC",
        zip: "20005",
        isDefault: false,
      },
    ]

    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: "pm1",
        type: "Visa",
        last4: "4242",
        expiry: "05/25",
        isDefault: true,
      },
      {
        id: "pm2",
        type: "Mastercard",
        last4: "8888",
        expiry: "12/24",
        isDefault: false,
      },
    ]

    setAddresses(mockAddresses)
    setPaymentMethods(mockPaymentMethods)

    // Set default selections
    const defaultAddress = mockAddresses.find((addr) => addr.isDefault)
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id)
    } else if (mockAddresses.length > 0) {
      setSelectedAddressId(mockAddresses[0].id)
    }

    const defaultPayment = mockPaymentMethods.find((pm) => pm.isDefault)
    if (defaultPayment) {
      setSelectedPaymentId(defaultPayment.id)
    } else if (mockPaymentMethods.length > 0) {
      setSelectedPaymentId(mockPaymentMethods[0].id)
    }
  }, [router])

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPayment((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()

    const newAddr: Address = {
      id: `addr${Date.now()}`,
      ...newAddress,
      isDefault: addresses.length === 0,
    }

    setAddresses((prev) => [...prev, newAddr])
    setSelectedAddressId(newAddr.id)
    setIsAddingAddress(false)
    setNewAddress({
      type: "Home",
      address: "",
      city: "",
      state: "",
      zip: "",
    })
  }

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send card info to a payment processor
    // and store only the token/last4 digits
    const newPm: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: newPayment.cardNumber.startsWith("4") ? "Visa" : "Mastercard",
      last4: newPayment.cardNumber.slice(-4),
      expiry: newPayment.expiry,
      isDefault: paymentMethods.length === 0,
    }

    setPaymentMethods((prev) => [...prev, newPm])
    setSelectedPaymentId(newPm.id)
    setIsAddingPayment(false)
    setNewPayment({
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
    })
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentId) {
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, this would send the order to the backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart
      localStorage.removeItem("cart")

      // Redirect to order confirmation
      router.push("/order-confirmation")
    } catch (error) {
      console.error("Error placing order:", error)
      setIsProcessing(false)
    }
  }

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)
  const selectedPayment = paymentMethods.find((pm) => pm.id === selectedPaymentId)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={getCartItemCount()} />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Delivery & Payment */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  <CardTitle>Delivery Address</CardTitle>
                </div>
                <CardDescription>Select where you want your order delivered</CardDescription>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-3">
                          <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={address.id} className="flex items-center cursor-pointer">
                              <span className="font-medium">{address.type}</span>
                              {address.isDefault && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">
                              {address.address}, {address.city}, {address.state} {address.zip}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">No saved addresses found</p>
                  </div>
                )}

                {isAddingAddress ? (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-medium mb-4">Add New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Address Type</Label>
                          <Select
                            value={newAddress.type}
                            onValueChange={(value) => setNewAddress({ ...newAddress, type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Home">Home</SelectItem>
                              <SelectItem value="Work">Work</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Street Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={newAddress.address}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={newAddress.city}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={newAddress.state}
                            onChange={handleAddressChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" name="zip" value={newAddress.zip} onChange={handleAddressChange} required />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Save Address
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddingAddress(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Delivery Time */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-red-500" />
                  <CardTitle>Delivery Time</CardTitle>
                </div>
                <CardDescription>Choose when you want your order delivered</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryTime} onValueChange={setDeliveryTime}>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="asap" id="asap" className="mt-1" />
                      <div>
                        <Label htmlFor="asap" className="font-medium cursor-pointer">
                          As soon as possible
                        </Label>
                        <p className="text-sm text-gray-500">Delivery in 25-35 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="scheduled" id="scheduled" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="scheduled" className="font-medium cursor-pointer">
                          Schedule for later
                        </Label>
                        <div className="mt-2 flex space-x-2">
                          <Select disabled={deliveryTime !== "scheduled"}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="tomorrow">Tomorrow</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select disabled={deliveryTime !== "scheduled"}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12:00">12:00 PM</SelectItem>
                              <SelectItem value="12:30">12:30 PM</SelectItem>
                              <SelectItem value="13:00">1:00 PM</SelectItem>
                              <SelectItem value="13:30">1:30 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-4">
                  <Label htmlFor="instructions" className="font-medium">
                    Delivery Instructions (Optional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Add any special instructions for delivery"
                    className="mt-2"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-red-500" />
                  <CardTitle>Payment Method</CardTitle>
                </div>
                <CardDescription>Select how you want to pay for your order</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length > 0 ? (
                  <RadioGroup value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
                    <div className="space-y-4">
                      {paymentMethods.map((payment) => (
                        <div key={payment.id} className="flex items-start space-x-3">
                          <RadioGroupItem value={payment.id} id={payment.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={payment.id} className="flex items-center cursor-pointer">
                              <span className="font-medium">
                                {payment.type} •••• {payment.last4}
                              </span>
                              {payment.isDefault && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </Label>
                            <p className="text-sm text-gray-500 mt-1">Expires {payment.expiry}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-4">No saved payment methods found</p>
                  </div>
                )}

                {isAddingPayment ? (
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-medium mb-4">Add New Payment Method</h3>
                    <form onSubmit={handleAddPayment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newPayment.cardNumber}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={newPayment.cardName}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiration Date</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={newPayment.expiry}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={newPayment.cvv}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddingPayment(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-500 hover:bg-red-600">
                          Save Payment Method
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddingPayment(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Payment Method
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${(getCartTotal() + 2.99 + getCartTotal() * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600"
                    disabled={!selectedAddressId || !selectedPaymentId || isProcessing}
                    onClick={handlePlaceOrder}
                  >
                    {isProcessing ? <>Processing Order...</> : <>Place Order</>}
                  </Button>

                  {(!selectedAddressId || !selectedPaymentId) && (
                    <div className="flex items-center text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Please select both delivery address and payment method</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


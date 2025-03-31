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
import { CreditCard, MapPin, Clock, AlertCircle, Plus, Minus } from "lucide-react"

interface Address {
  id: string
  type: string
  address: string
  city: string
  state: string
  zip: string
  isDefault: boolean
}
interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_veg: boolean;
  is_available: boolean;
  category_id: string;
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
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); // selected item from the "Order Now" button
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1); // selected quantity (set to 1 initially)
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
    // Fetch mock addresses and payment methods (simulate fetching)
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

    // Set default selections for address and payment
    const defaultAddress = mockAddresses.find((addr) => addr.isDefault)
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id)
    }

    const defaultPayment = mockPaymentMethods.find((pm) => pm.isDefault)
    if (defaultPayment) {
      setSelectedPaymentId(defaultPayment.id)
    }
  }, [])

  const getCartTotal = () => {
    return (selectedItem ? selectedItem.price * selectedQuantity : 0);
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentId) {
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, this would send the order to the backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart or reset any necessary data
      // Redirect to order confirmation
      router.push("/order-confirmation")
    } catch (error) {
      console.error("Error placing order:", error)
      setIsProcessing(false)
    }
  }
  useEffect(() => {
    const item = localStorage.getItem("selectedItem");
    if (item) {
      setSelectedItem(JSON.parse(item)); // Set the selected item
      setSelectedQuantity(parseInt(localStorage.getItem("selectedQuantity") || "1")); // Set the quantity
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={1} /> {/* Placeholder for cart count */}

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
          {selectedItem && (
            <div key={selectedItem._id} className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="font-medium">{selectedItem.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="px-4 py-1"
                    onClick={() => setSelectedQuantity((prev) => Math.max(prev - 1, 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span>{selectedQuantity}</span>
                  <Button
                    variant="outline"
                    className="px-4 py-1"
                    onClick={() => setSelectedQuantity((prev) => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="font-bold">${(selectedItem.price * selectedQuantity).toFixed(2)}</div>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${(selectedItem ? selectedItem.price * selectedQuantity : 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${((selectedItem ? selectedItem.price * selectedQuantity : 0) * 0.08).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>
              ${(
                (selectedItem ? selectedItem.price * selectedQuantity : 0) +
                2.99 +
                (selectedItem ? selectedItem.price * selectedQuantity : 0) * 0.08
              ).toFixed(2)}
            </span>
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

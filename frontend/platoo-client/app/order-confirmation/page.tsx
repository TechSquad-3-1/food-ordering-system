"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Check, Clock, MapPin, ArrowRight } from "lucide-react"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null) // Use any for flexibility
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false)

  useEffect(() => {
    const orderId = localStorage.getItem("orderId")
    console.log("Order ID from localStorage:", orderId)

    if (orderId) {
      fetchOrderDetails(orderId)
    } else {
      console.error("No order ID found in localStorage.")
    }
  }, [])

  // Fetch order details from the backend API
  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:3008/api/orders/${orderId}`)
      const data = await response.json()
      if (data) {
        setOrderDetails(data)
      } else {
        console.error("Order details not found.")
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    }
  }

  // Display loading message until orderDetails are fetched
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={0} />
        <main className="max-w-[1400px] mx-auto px-6 py-8">
          <h2>Loading order details...</h2>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-500">
              Your order has been placed successfully. We'll notify you once it's on the way.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order #{orderDetails.order_id}</CardTitle>
              <CardDescription>Thank you for your order from {orderDetails.restaurant}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Estimated Delivery Time</h3>
                  <p className="text-gray-500">{orderDetails.estimatedDelivery}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <p className="text-gray-500">{orderDetails.deliveryAddress}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="font-medium">Order Summary</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    {orderDetails.items && orderDetails.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </div>
                        <div>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${orderDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${orderDetails.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button variant="outline" className="flex-1" onClick={() => router.push("/restaurants")}>
                  Order More Food
                </Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">Have questions about your order?</p>
            <Button variant="link" className="text-red-500">
              Contact Support <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

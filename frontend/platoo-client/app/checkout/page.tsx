"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, MapPin, AlertCircle, Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

interface Restaurant {
  _id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: string;
  minOrder: string;
  distance: string;
  address: string;
  cuisines: string[];
  priceLevel: number;
  description: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const restaurantId = localStorage.getItem("restaurantId");
      if (restaurantId) {
        try {
          const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}`);
          const restaurantData = await response.json();
          if (restaurantData) {
            setRestaurant(restaurantData);
          } else {
            console.error("Restaurant data not found");
          }
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
        }
      } else {
        console.error("No restaurantId found in localStorage");
      }
    };

    fetchRestaurantData();

    const item = localStorage.getItem("selectedItem");
    if (item) {
      setSelectedItem(JSON.parse(item));
      setSelectedQuantity(parseInt(localStorage.getItem("selectedQuantity") || "1"));
    }
  }, []);

  const getCartTotal = () => {
    return selectedItem ? selectedItem.price * selectedQuantity : 0;
  };

  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId);

  if (!userId) {
    alert("User is not logged in. Please log in before placing the order.");
    return;
  }

  const handlePlaceOrder = async () => {
    if (!deliveryAddress || !phone || !email || !selectedItem || !restaurant) {
        console.log("Order not placed. Missing data.");
        return;
    }

    setIsProcessing(true);

    try {
        // Calculate subtotal and delivery fee (no tax anymore)
        const subtotal = selectedItem.price * selectedQuantity;
        const deliveryFee = 2.99;

        // Correct total calculation for the order (without tax)
        const totalAmount = (subtotal + deliveryFee).toFixed(2); // Pass it as a string with 2 decimals

        // Prepare the order data
        const orderData = {
            user_id: userId,
            restaurant_id: restaurant._id,
            items: [
                {
                    menu_item_id: selectedItem._id,
                    quantity: selectedQuantity,
                    price: selectedItem.price,
                },
            ],
            total_amount: parseFloat(totalAmount), // Send the value as float, not a string
            delivery_fee: deliveryFee,
            status: "pending",
            delivery_address: deliveryAddress,
            phone: phone,
            email: email,
        };

        console.log("Order Data:", orderData); // Log order data for debugging

        const orderResponse = await fetch("http://localhost:3008/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        if (orderResponse.ok) {
            const orderConfirmation = await orderResponse.json();
            console.log("Order Confirmation:", orderConfirmation);

            if (orderConfirmation && orderConfirmation.order && orderConfirmation.order.order_id) {
                const orderId = orderConfirmation.order.order_id;
                localStorage.setItem("order_id", orderId); // Save order_id in localStorage
                console.log("Order ID saved to localStorage:", orderId);
            } else {
                console.error("Order ID not returned by the backend");
            }

            // Proceed with payment (pass the correct total amount)
            const paymentData = {
                amount: totalAmount, // Correct amount for the payment
                quantity: selectedQuantity,
                name: selectedItem.name,
                currency: "USD",
            };

            const paymentResponse = await fetch("http://localhost:8080/product/v1/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentData),
            });

            if (paymentResponse.ok) {
                const paymentConfirmation = await paymentResponse.json();
                if (paymentConfirmation.sessionUrl) {
                    window.location.href = paymentConfirmation.sessionUrl;
                } else {
                    console.error("Failed to create Stripe session.");
                    setIsProcessing(false);
                }
            } else {
                console.error("Failed to create Stripe session.");
                setIsProcessing(false);
            }
        } else {
            console.error("Failed to place order. Response status:", orderResponse.status);
            setIsProcessing(false);
        }
    } catch (error) {
        console.error("Error placing order:", error);
        setIsProcessing(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={1} />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-500" />
                  <CardTitle>Order Details</CardTitle>
                </div>
                <CardDescription>Provide your delivery address, phone, and email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardFooter className="flex-col space-y-4">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                >
                  {isProcessing ? <>Processing Order...</> : <>Place Order</>}
                </Button>

                {(!deliveryAddress || !phone || !email) && (
                  <div className="flex items-center text-sm text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Please fill in the delivery address, phone, and email</span>
                  </div>
                )}
              </CardFooter>
            </Card>
          </div>

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
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>
                        ${(
                          (selectedItem ? selectedItem.price * selectedQuantity : 0) +
                          2.99
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

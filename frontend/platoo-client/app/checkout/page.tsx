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

interface Address {
  id: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("");
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
    ];

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
    ];

    setAddresses(mockAddresses);
    setPaymentMethods(mockPaymentMethods);

    const defaultAddress = mockAddresses.find((addr) => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }

    const defaultPayment = mockPaymentMethods.find((pm) => pm.isDefault);
    if (defaultPayment) {
      setSelectedPaymentId(defaultPayment.id);
    }

    const item = localStorage.getItem("selectedItem");
    if (item) {
      setSelectedItem(JSON.parse(item));
      setSelectedQuantity(parseInt(localStorage.getItem("selectedQuantity") || "1"));
    }
  }, []);

  const getCartTotal = () => {
    return selectedItem ? selectedItem.price * selectedQuantity : 0;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentId || !selectedItem || !restaurant) {
      console.log("Order not placed. Missing data.");
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const userId = localStorage.getItem("userId");
  
      // Calculate subtotal, delivery fee, and tax
      const subtotal = selectedItem.price * selectedQuantity;
      const deliveryFee = 2.99;
      const tax = subtotal * 0.08;
      const totalAmount = subtotal + deliveryFee + tax;
  
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
        total_amount: totalAmount.toFixed(2),
        delivery_fee: deliveryFee,
        status: "pending",
      };
  
      const orderResponse = await fetch("http://localhost:3008/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (orderResponse.ok) {
        const orderConfirmation = await orderResponse.json();
        console.log("Order Confirmation:", orderConfirmation); // Log the full response
  
        // Ensure order_id is available in the response and store it in localStorage
        if (orderConfirmation && orderConfirmation.order && orderConfirmation.order.order_id) {
          const orderId = orderConfirmation.order.order_id;
          localStorage.setItem("order_id", orderId); // Save order_id in localStorage
          console.log("Order ID saved to localStorage:", orderId); // Confirm that it's saved
        } else {
          console.error("Order ID not returned by the backend");
        }
  
        // Proceed with payment (if applicable)
        const paymentData = {
          amount: totalAmount,
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
  );
}

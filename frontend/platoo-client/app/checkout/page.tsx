"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, AlertCircle, Plus, Minus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/useCart";

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

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(2.99);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    const restaurantId = localStorage.getItem("restaurantId");
    if (restaurantId) {
      fetch(`http://localhost:3001/api/restaurants/${restaurantId}`)
        .then((res) => res.json())
        .then(setRestaurant)
        .catch((err) => console.error("Failed to fetch restaurant:", err));
    }

    const cart = localStorage.getItem("checkoutCart");
    if (cart) {
      const items: CartItem[] = JSON.parse(cart);
      setCartItems(items);

      const calcSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const calcTax = calcSubtotal * 0.08;
      const calcTotal = calcSubtotal + deliveryFee + calcTax;

      setSubtotal(calcSubtotal);
      setTax(calcTax);
      setTotal(calcTotal);
    } else {
      const item = localStorage.getItem("selectedItem");
      const quantity = localStorage.getItem("selectedQuantity") || "1";

      if (item) {
        setSelectedItem(JSON.parse(item));
        setSelectedQuantity(parseInt(quantity));
      }
    }

    return () => {
      localStorage.removeItem("checkoutCart");
      localStorage.removeItem("selectedItem");
      localStorage.removeItem("selectedQuantity");
    };
  }, []);

  if (!userId) {
    alert("User is not logged in. Please log in before placing the order.");
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!deliveryAddress || !phone || !email || (!selectedItem && cartItems.length === 0)) {
      console.log("Missing order details");
      return;
    }

    setIsProcessing(true);

    try {
      const itemsToSend =
        cartItems.length > 0
          ? cartItems.map((item) => ({
              menu_item_id: item.productId,
              quantity: item.quantity,
              price: item.price, // Ensure it's treated as a number
              name: item.name, // Include the name
            }))
          : [
              {
                menu_item_id: selectedItem!._id,
                quantity: selectedQuantity,
                price: selectedItem!.price, // Ensure it's treated as a number
                name: selectedItem!.name,
              },
            ];

      const orderTotal = cartItems.length > 0 ? total : selectedItem!.price * selectedQuantity + deliveryFee;

      const orderPayload = {
        user_id: userId,
        restaurant_id: restaurant?._id,
        items: itemsToSend,
        total_amount: orderTotal,
        delivery_fee: deliveryFee,
        status: "pending",
        delivery_address: deliveryAddress,
        phone,
        email,
      };

      localStorage.setItem("pending_order", JSON.stringify(orderPayload));

      const paymentData = {
        amount: orderTotal.toFixed(2), // Ensure the total is a string with two decimal places
        quantity: itemsToSend.reduce((acc, item) => acc + item.quantity, 0),
        name: "Food Order",
        currency: "USD",
        successUrl: "http://localhost:8000/payment-success",
        cancelUrl: "http://localhost:8000/checkout",
      };

      const response = await fetch("http://localhost:8080/product/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      if (response.ok && result.sessionUrl) {
        window.location.href = result.sessionUrl;
      } else {
        console.error("Payment session failed.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setIsProcessing(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartItems.length || 1} />
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
                  <input type="text" placeholder="Enter delivery address" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardFooter className="flex-col space-y-4">
                <Button className="w-full bg-red-500 hover:bg-red-600" disabled={isProcessing} onClick={handlePlaceOrder}>
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
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          </div>
                          <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))
                    ) : selectedItem ? (
                      <div key={selectedItem._id} className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-medium">{selectedItem.name}</span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" className="px-4 py-1" onClick={() => setSelectedQuantity((prev) => Math.max(prev - 1, 1))}>
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span>{selectedQuantity}</span>
                            <Button variant="outline" className="px-4 py-1" onClick={() => setSelectedQuantity((prev) => prev + 1)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="font-bold">${(selectedItem.price * selectedQuantity).toFixed(2)}</div>
                      </div>
                    ) : (
                      <p>No items in cart</p>
                    )}
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cartItems.length > 0 ? subtotal.toFixed(2) : ((selectedItem?.price || 0) * selectedQuantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${cartItems.length > 0 ? tax.toFixed(2) : ((selectedItem?.price || 0) * selectedQuantity * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${cartItems.length > 0 ? total.toFixed(2) : ((selectedItem?.price || 0) * selectedQuantity + deliveryFee).toFixed(2)}</span>
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

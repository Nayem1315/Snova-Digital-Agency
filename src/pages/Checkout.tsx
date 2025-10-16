import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useCart } from "@/context/CartContext"; // Assumed available
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

// Mock implementation for useCart context for component completeness
const useCart = () => {
    // This assumes your actual useCart hook provides these values
    const cart = [
        { id: 101, title: "Web Design Package", price: 500.00, quantity: 1 },
        { id: 102, title: "SEO Optimization", price: 150.00, quantity: 2 },
    ];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const clearCart = () => console.log("Cart Cleared (mock)");
    return { cart, totalPrice, clearCart };
};


const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100, "First name too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  address: z.string().trim().min(1, "Address is required").max(500, "Address too long"),
  city: z.string().trim().min(1, "City is required").max(100, "City too long"),
  zip: z.string().trim().min(1, "ZIP code is required").max(20, "ZIP code too long"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits").optional(),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY format").optional(),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits").optional(),
});

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        toast.error("Please log in to complete your purchase");
        navigate("/auth");
      }
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error("User not logged in. Please log in first.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      zip: formData.get("zip") as string,
      cardNumber: paymentMethod === "card" ? formData.get("cardNumber") as string : undefined,
      expiry: paymentMethod === "card" ? formData.get("expiry") as string : undefined,
      cvv: paymentMethod === "card" ? formData.get("cvv") as string : undefined,
    };
    
    // Final Order Object for Firestore
    const orderData = {
      user_id: user.uid,
      total_amount: totalPrice,
      payment_method: paymentMethod,
      payment_status: "completed",
      billing_name: `${data.firstName} ${data.lastName}`,
      billing_email: data.email,
      billing_address: data.address,
      billing_city: data.city,
      billing_zip: data.zip,
      billing_country: "US", // Hardcoded as per original code
      created_at: new Date(),
      order_items: cart.map(item => ({
        product_id: item.id.toString(),
        product_title: item.title,
        product_price: item.price,
        quantity: item.quantity
      })),
    };

    try {
      // Validate input
      checkoutSchema.parse(data);

      // Save the order to Firestore under the user's subcollection
      const ordersCollectionRef = collection(db, "users", user.uid, "orders");
      await addDoc(ordersCollectionRef, orderData);

      setShowConfirmation(true);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error("Firestore Order Error:", error);
        toast.error(error.message || "Failed to process order");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = () => {
    clearCart();
    setShowConfirmation(false);
    navigate("/dashboard");
  };

  if (cart.length === 0 && !showConfirmation) {
    navigate("/cart");
    return null;
  }
  
  // Loading state while auth is being checked
  if (!user) {
    return (
        <div className="container mx-auto px-4 py-20 text-center flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
            <p className="ml-2 text-lg">Verifying Authentication...</p>
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Information */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Billing Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" maxLength={100} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" maxLength={100} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" maxLength={255} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" maxLength={500} required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" maxLength={100} required />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" name="zip" maxLength={20} required />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="bkash" id="bkash" />
                  <Label htmlFor="bkash" className="cursor-pointer">Bkash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rocket" id="rocket" />
                  <Label htmlFor="rocket" className="cursor-pointer">Rocket</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456" 
                      maxLength={16}
                      pattern="\d{16}"
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        name="expiry"
                        placeholder="MM/YY" 
                        maxLength={5}
                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        name="cvv"
                        placeholder="123" 
                        maxLength={4}
                        pattern="\d{3,4}"
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={loading || !user}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : `Confirm Payment - $${totalPrice.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">{item.title} x{item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">Order Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your purchase! Your order has been successfully processed.
              You can now access your products from your dashboard.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleConfirmation} className="w-full">
            Go to Dashboard
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;

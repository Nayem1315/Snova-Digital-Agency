import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started!</p>
        <Link to="/shop">
          <Button size="lg">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.category}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Input placeholder="Promo code" />
                <Button variant="outline">Apply</Button>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link to="/shop">
              <Button variant="outline" className="w-full mt-4">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;

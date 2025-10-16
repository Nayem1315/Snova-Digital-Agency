import { useParams, Link } from "react-router-dom";
import { products } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <div className="animate-fade-in">
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-primary">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{product.description}</p>

          {/* Features */}
          {product.features && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">What's included:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold">${product.price}</span>
          </div>

          <Button size="lg" onClick={handleAddToCart} className="w-full mb-4">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-2">Product Information</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Instant download after purchase</li>
              <li>✓ Lifetime access to all updates</li>
              <li>✓ 30-day money-back guarantee</li>
              <li>✓ Premium support included</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  U{i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">User {i + 1}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                Excellent product! Exactly what I was looking for. Highly recommended.
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

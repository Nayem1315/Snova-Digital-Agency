import { Star, ShoppingCart } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Product } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success("Added to cart!");
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden hover-lift cursor-pointer group">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>
          </div>
          <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${product.price}</span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="group/btn"
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:animate-bounce" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;

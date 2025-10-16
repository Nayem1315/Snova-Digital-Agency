import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { products, testimonials, categories } from "@/lib/mockData";
import { ArrowRight, Package, Shield, Zap, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import heroBg from "@/assets/hero-bg.jpg";

const Home = () => {
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Premium
              <span className="gradient-primary bg-clip-text text-transparent"> Digital Products</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your destination for high-quality courses, software, templates, and creative assets.
              Download instantly and start creating.
            </p>
            <Link to="/shop">
              <Button size="lg" className="glow">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Instant Download", desc: "Get your products immediately after purchase" },
              { icon: Shield, title: "Secure Payments", desc: "Safe and encrypted payment processing" },
              { icon: Package, title: "Quality Products", desc: "Curated selection of premium digital goods" },
            ].map((feature, i) => (
              <Card key={i} className="p-6 text-center hover-lift">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/shop">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.slice(1).map((category, i) => (
              <Link key={i} to={`/shop?category=${category}`}>
                <Card className="p-6 text-center hover-lift cursor-pointer">
                  <h3 className="font-semibold">{category}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Stay Updated</h2>
          <p className="text-xl text-white/90 mb-8">
            Subscribe to our newsletter for exclusive deals and new products
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

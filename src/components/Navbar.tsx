import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, User, Search, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import logo from "@/assets/snova-logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { Input } from "./ui/input";


const Navbar = () => {
  const { totalItems } = useCart();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowMobileSearch(false); // Close mobile search on submit
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const mainNavLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const moreNavLinks = [
    { to: "/faq", label: "FAQ" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/privacy", label: "Privacy Policy" },
  ];

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Snova Digital Agency" className="h-10 w-10" />
            <span>
              Snova Digital Agency
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:text-primary transition-colors px-0">
                  More <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {moreNavLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 border rounded-md px-2">
              <Input 
                type="search" 
                placeholder="Search..." 
                className="border-none focus:outline-none focus:ring-0" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="ghost" size="icon" type="submit">
                <Search className="h-5 w-5" />
              </Button>
            </form>
            {/* Mobile Search Trigger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileSearch(true)}>
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {[...mainNavLinks, ...moreNavLinks].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-lg text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-[100] bg-background md:hidden animate-fade-in">
          <form onSubmit={handleSearch} className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 border rounded-md px-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="border-none focus:outline-none focus:ring-0 h-12 text-lg w-full"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileSearch(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

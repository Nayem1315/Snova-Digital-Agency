import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      {theme === "dark" ? (
        <Moon 
          className={`h-5 w-5 text-white transition-all duration-300 ${
            isAnimating ? "animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : ""
          }`} 
        />
      ) : (
        <Sun 
          className={`h-5 w-5 text-yellow-500 transition-all duration-300 ${
            isAnimating ? "animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" : ""
          }`} 
        />
      )}
    </Button>
  );
}

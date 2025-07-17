"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState("light");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme, mounted]);


  const toggleTheme = () => {
    setTheme(currentTheme => {
        const newTheme = currentTheme === "light" ? "dark" : "light";
        window.localStorage.setItem("theme", newTheme);
        return newTheme;
    });
  };

  if (!mounted) {
    return (
       <Button variant="ghost" size="sm" className="w-full justify-start" disabled>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
          <span className="group-data-[collapsible=icon]:hidden">Toggle theme</span>
          <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 mr-2" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 mr-2" />
      <span className="group-data-[collapsible=icon]:hidden">Toggle theme</span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "@thirdweb-dev/react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-background'}`}>
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-110"
          >
            <path d="M6 12h12" />
            <path d="M3 6h18" />
            <path d="M3 18h18" />
            <path d="M6 6c0 6 1.5 6 6 6s6 0 6-6" />
            <path d="M6 18c0-6 1.5-6 6-6s6 0 6 6" />
          </svg>
          <span className="text-sm sm:text-lg font-bold">RupayaBridge</span>
        </Link>
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <ConnectWallet 
            className="!py-1 !px-2 !text-xs sm:!py-2 sm:!px-3 sm:!text-sm !font-medium"
            btnTitle="Connect"
          />
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">RupayaBridge</SheetTitle>
                <SheetDescription>
                  Navigate RupayaBridge
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={`text-lg font-medium transition-colors ${
                        pathname === item.href
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Close Menu
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
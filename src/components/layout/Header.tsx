"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Feather } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About Us' },
  { href: '/download', label: 'Download' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center space-x-2">
            <Feather className="h-7 w-7 text-primary" />
            <span className="font-headline text-2xl font-bold text-primary">LifeSync AI</span>
          </Link>
          <div className="h-6 w-6 animate-pulse bg-muted rounded-md md:hidden"></div>
          <nav className="hidden md:flex items-center space-x-6">
            <div className="h-4 w-10 animate-pulse bg-muted rounded-md"></div>
            <div className="h-4 w-12 animate-pulse bg-muted rounded-md"></div>
            <div className="h-4 w-16 animate-pulse bg-muted rounded-md"></div>
            <div className="h-9 w-28 animate-pulse bg-primary/50 rounded-full"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="relative flex h-16 items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Feather className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent">LifeSync AI</span>
        </Link>

        {/* Desktop Nav (absolute right) */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 absolute right-6 top-1/2 -translate-y-1/2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary duration-200",
                pathname === item.href ? "text-primary" : "text-foreground/70"
              )}
            >
              {item.label}
            </Link>
          ))}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button asChild className="rounded-full shadow-soft hover:shadow-soft-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-primary-foreground px-5 py-2 text-sm">
              <Link href="/download">Download App</Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-foreground/70 hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-border/50">
                  <Link href="/" className="flex items-center space-x-2 mb-1" onClick={() => setMenuOpen(false)}>
                    <Feather className="h-7 w-7 text-primary" />
                    <span className="font-headline text-xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent">LifeSync AI</span>
                  </Link>
                </div>
                <nav className="flex-grow p-6 space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block text-base font-medium transition-colors hover:text-primary py-2 rounded-md px-3",
                        pathname === item.href ? "text-primary bg-primary/10" : "text-foreground/80 hover:bg-secondary/50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-auto p-6 border-t border-border/50">
                  <Button asChild className="w-full rounded-full shadow-soft hover:shadow-soft-lg bg-gradient-to-r from-blue-600 to-violet-600 text-primary-foreground py-2.5 text-sm">
                    <Link href="/download" onClick={() => setMenuOpen(false)}>Download App</Link>
                  </Button>
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


"use client";
import Link from 'next/link';
import { Instagram, Linkedin, Twitter, Feather } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react'; // Import useState and useEffect

const footerLinkGroups = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/features", label: "Features" },
      { href: "/contact", label: "Contact" },
    ]
  },
  {
    title: "Resources",
    links: [
      { href: "#", label: "Blog" }, 
      { href: "/download#faq", label: "FAQ" }, 
      { href: "#", label: "Support Center" }, 
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" }, 
    ]
  }
];

const socialLinks = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
];

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear()); // Initial value

  useEffect(() => {
    // Ensures the year is determined on the client side after hydration
    setYear(new Date().getFullYear());
  }, []);

  return (
    <motion.footer 
      className="bg-card text-card-foreground border-t border-border/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="container mx-auto py-10 px-6 max-w-6xl"> {/* Consistent padding py-10 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Logo and Slogan - Spans 2 cols on lg */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center space-x-2.5 mb-3">
              <Feather className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-headline text-primary">LifeSync AI</span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Your AI-Powered Health Companion. Empowering healthier lives through technology, insights, and care.
            </p>
             <div className="flex space-x-3 mt-5">
              {socialLinks.map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 p-2 bg-secondary/50 hover:bg-secondary rounded-full"
                  whileHover={{ y: -2, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {footerLinkGroups.map(group => (
             <div key={group.title} className="text-left">
              <h3 className="text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">{group.title}</h3>
              <nav className="flex flex-col space-y-2 text-xs">
                {group.links.map(link => (
                  <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
           <div className="text-left">
                 <h3 className="text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">App Version</h3>
                 <p className="text-xs text-muted-foreground/90">LifeSync AI v1.0.0 (Beta)</p>
                 <p className="text-xs text-muted-foreground/80 mt-1">Student Initiative Project</p>
            </div>
        </div>
        
        <div className="pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          &copy; {year} LifeSync AI. All rights reserved. Student Project. Not for commercial use.
        </div>
      </div>
    </motion.footer>
  );
}

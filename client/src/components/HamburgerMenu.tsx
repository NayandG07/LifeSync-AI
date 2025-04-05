import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MenuLink {
  href: string;
  label: string;
}

interface HamburgerMenuProps {
  links: MenuLink[];
}

const HamburgerMenu = ({ links }: HamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    navigate(href);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Menu Container */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <Menu className="w-7 h-7 text-white" />
          )}
        </button>

        {/* Menu Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-56 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <nav className="flex flex-col">
                {links.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className="px-4 py-3 text-base text-gray-700 dark:text-gray-200 hover:bg-primary/10 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default HamburgerMenu; 
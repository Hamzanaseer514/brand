'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/track-order', label: 'Track Order' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-luxury-black/95 backdrop-blur-md shadow-glass border-b border-luxury-gold/20'
          : 'bg-luxury-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent tracking-wide"
            >
              A & N
            </motion.div>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <nav className="flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-luxury-ivory hover:text-luxury-gold transition-colors font-medium text-sm tracking-wide uppercase px-2 py-1"
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Search and Cart - Right Side */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold/70" size={18} />
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 xl:w-64 pl-10 pr-4 py-2.5 rounded-full bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 text-luxury-ivory placeholder-luxury-ivory/50 text-sm transition-all"
              />
            </div>

            <Link href="/cart" className="relative p-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ShoppingBag className="text-luxury-gold transition-colors" size={24} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-luxury"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-luxury-gold p-2 hover:bg-luxury-gold/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-4"
            >
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold/70" size={18} />
                <input
                  type="text"
                  placeholder="Search fragrances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-luxury-charcoal/50 border border-luxury-gold/20 focus:outline-none focus:border-luxury-gold text-luxury-ivory placeholder-luxury-ivory/50 text-sm"
                />
              </div>

              {/* Mobile Menu Links */}
              <div className="mt-4 pt-4 border-t border-luxury-gold/20 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-3 px-2 text-luxury-ivory hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-all font-medium uppercase tracking-wide text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  className="flex items-center gap-3 py-3 px-2 text-luxury-ivory hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="text-luxury-gold" size={20} />
                  <span className="font-medium uppercase tracking-wide text-sm">
                    Cart {totalItems > 0 && `(${totalItems})`}
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

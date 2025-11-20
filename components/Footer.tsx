'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/shop' },
      { label: 'Woody Scents', href: '/shop?category=Woody' },
      { label: 'Floral Scents', href: '/shop?category=Floral' },
      { label: 'Fresh Scents', href: '/shop?category=Fresh' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Return Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative bg-luxury-black border-t border-luxury-gold/20 mt-20">
      {/* Gold Accent Line */}
      <div className="h-px bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-serif font-bold mb-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-light bg-clip-text text-transparent">
              A & N
            </h3>
            <p className="text-luxury-ivory/70 mb-2 leading-relaxed">
              The Essence of Tradition, Crafted with Luxury. Experience authentic Arabic perfumery with our premium collection.
            </p>
            <p className="text-luxury-gold/80 mb-6 text-sm font-medium">
              Owner: Rana Nouman
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass rounded-full p-3 text-luxury-gold hover:bg-luxury-gold/20 transition-colors border border-luxury-gold/20"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-luxury-gold uppercase tracking-wide">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-luxury-gold uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={`company-${link.label}-${index}`}>
                  <Link
                    href={link.href}
                    className="text-luxury-ivory/70 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-serif font-semibold mb-6 text-luxury-gold uppercase tracking-wide">
              Stay Connected
            </h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-sm text-luxury-ivory/70">
                <MapPin className="text-luxury-gold mt-1" size={16} />
                <span>123 Perfume Street, Luxury District, Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-ivory/70">
                <Phone className="text-luxury-gold" size={16} />
                <a href="tel:+923474566501" className="hover:text-luxury-gold transition-colors">
                  +92 347 4566501
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-ivory/70">
                <Mail className="text-luxury-gold" size={16} />
                <span>info@luxeittar.com</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-luxury-ivory/70 mb-3">
                Subscribe for exclusive offers
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2.5 rounded-lg bg-luxury-charcoal border border-luxury-gold/20 text-luxury-ivory placeholder-luxury-ivory/50 focus:outline-none focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold py-2.5 rounded-lg hover:shadow-luxury transition-all"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-luxury-gold/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-luxury-ivory/50">
            &copy; {currentYear} A & N by Rana Nouman. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-luxury-ivory/50 hover:text-luxury-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

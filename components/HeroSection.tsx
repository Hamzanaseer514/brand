'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if mobile/tablet to disable parallax
  useEffect(() => {
    setMounted(true);
    let resizeTimer: NodeJS.Timeout;
    const checkMobile = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const isMobileDevice = window.innerWidth < 768 || window.innerHeight < 700;
        setIsMobile(isMobileDevice);
      }, 150);
    };
    // Initial check
    const isMobileDevice = typeof window !== 'undefined' && (window.innerWidth < 768 || window.innerHeight < 700);
    setIsMobile(isMobileDevice);
    
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Only enable parallax on desktop
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className="relative min-h-[550px] sm:min-h-[650px] md:min-h-screen flex items-center justify-center overflow-hidden bg-luxury-black pt-20 md:pt-28 pb-12 sm:pb-24 md:pb-28">
      {/* Smoke Animation Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute smoke"
            initial={{
              x: `${20 + i * 20}%`,
              y: '100%',
              opacity: 0.2,
            }}
            animate={{
              y: '-50%',
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            style={{
              width: `${200 + i * 50}px`,
              height: `${300 + i * 100}px`,
              background: `radial-gradient(circle, rgba(201, 161, 74, 0.1) 0%, transparent 70%)`,
              borderRadius: '50%',
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      {/* Parallax Content */}
      <motion.div
        style={isMobile || !mounted ? { opacity: 1, y: 0 } : { y, opacity }}
        className="relative z-20 container mx-auto px-4 sm:px-6 text-center"
      >
        {/* Perfume Bottles */}
        <div className="flex justify-center gap-2 sm:gap-6 md:gap-8 mb-6 sm:mb-12 md:mb-16">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="relative"
            >
              <div className="relative w-20 h-40 sm:w-28 sm:h-56 md:w-32 md:h-64 lg:w-36 lg:h-72 xl:w-40 xl:h-80 rounded-t-[50px] glass-reflection">
                <div
                  className="absolute inset-0 rounded-t-full"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(201, 161, 74, ${0.3 + i * 0.1}) 0%, 
                      rgba(201, 161, 74, ${0.1 + i * 0.05}) 100%)`,
                    boxShadow: `0 20px 60px rgba(201, 161, 74, 0.4)`,
                  }}
                />
                <div
                  className="absolute inset-2 rounded-t-full glass-reflection"
                  style={{
                    background: `linear-gradient(180deg, 
                      transparent 0%, 
                      rgba(255, 255, 255, 0.2) 30%, 
                      transparent 60%)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-6 sm:mb-8"
          style={{ willChange: isMobile ? 'auto' : 'transform' }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-2 sm:mb-5 md:mb-6 bg-gradient-to-r from-luxury-gold via-luxury-gold-light to-luxury-gold bg-clip-text text-transparent px-2 leading-tight">
            The Essence of Tradition
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif text-luxury-ivory/80 tracking-wider px-2">
            Crafted with Luxury
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-luxury-ivory/70 max-w-2xl mx-auto mb-6 sm:mb-12 md:mb-16 text-sm sm:text-lg md:text-xl leading-relaxed px-4"
          style={{ willChange: isMobile ? 'auto' : 'transform' }}
        >
          Discover our exquisite collection of premium ittars, where ancient traditions meet
          contemporary elegance. Each fragrance is a masterpiece of artistry.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          style={{ willChange: isMobile ? 'auto' : 'transform' }}
        >
          <Link href="/shop" className="block px-2">
            <motion.button
              whileHover={!isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex px-6 sm:px-10 md:px-12 lg:px-14 py-2.5 sm:py-3.5 md:py-4 bg-gradient-to-r from-luxury-gold to-luxury-gold-dark text-luxury-black font-semibold text-xs sm:text-base md:text-lg lg:text-xl tracking-wide uppercase rounded-full overflow-hidden gold-glow w-full sm:w-auto"
              style={{ willChange: isMobile ? 'auto' : 'transform' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span>Explore Collection</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform flex-shrink-0" size={18} />
              </span>
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 shimmer"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <div className="w-6 h-10 border-2 border-luxury-gold/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-luxury-gold rounded-full mt-2"
          />
        </div>
      </motion.div>
    </div>
  );
}

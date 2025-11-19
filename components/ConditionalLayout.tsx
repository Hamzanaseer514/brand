'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCart from '@/components/FloatingCart';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide Navbar, Footer, and FloatingCart on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <FloatingCart />}
      {!isAdminPage && <Footer />}
    </>
  );
}


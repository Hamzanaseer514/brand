import type { Metadata } from "next";
import { Playfair_Display, Inter, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aandnscents.com'),
  title: {
    default: "A & N - Premium Arabic Perfumes | Authentic Ittar Collection",
    template: "%s | A & N Premium Perfumes",
  },
  description: "The Essence of Tradition, Crafted with Luxury. Discover our collection of premium ittars crafted with traditional artistry and the finest ingredients. Shop authentic Arabic perfumes online.",
  keywords: [
    "Arabic perfumes",
    "Ittar",
    "Premium perfumes",
    "Oud perfumes",
    "Sandalwood perfumes",
    "Luxury fragrances",
    "Traditional perfumes",
    "A & N perfumes",
    "Rana Nouman",
    "Sialkot perfumes",
    "Pakistani perfumes",
    "Woody scents",
    "Floral perfumes",
    "Amber fragrances",
  ],
  authors: [{ name: "Rana Nouman" }],
  creator: "Rana Nouman",
  publisher: "A & N",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.aandnscents.com",
    siteName: "A & N Premium Perfumes",
    title: "A & N - Premium Arabic Perfumes | Authentic Ittar Collection",
    description: "The Essence of Tradition, Crafted with Luxury. Discover our collection of premium ittars crafted with traditional artistry and the finest ingredients.",
    images: [
      {
        url: "/images/1.png",
        width: 1200,
        height: 630,
        alt: "A & N Premium Arabic Perfumes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A & N - Premium Arabic Perfumes",
    description: "The Essence of Tradition, Crafted with Luxury. Discover authentic Arabic perfumes.",
    images: ["/images/1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification code here when available
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.aandnscents.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} ${cinzel.variable} ${cormorant.variable} antialiased bg-luxury-black text-luxury-ivory`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

# A & N - Premium E-Commerce Website

A fully responsive, modern Next.js eCommerce website for premium Ittar (Arabic perfumes) built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🏠 **Home Page** - Hero section with animated elements, featured categories, top-selling products, and customer testimonials
- 🛍️ **Shop Page** - Product listing with advanced filtering, sorting, and search functionality
- 📦 **Product Detail Page** - Detailed product view with image gallery, reviews, and add to cart
- 🛒 **Shopping Cart** - Full cart management with quantity controls
- 💳 **Checkout Page** - Complete checkout flow with shipping and payment forms
- 📖 **About Page** - Brand story and craftsmanship information
- 📧 **Contact Page** - Contact form and location information

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management for cart
- **React Icons** - Icon library

## Design

The website features a luxurious color scheme:
- **Gold** (#d4af37) - Luxury and elegance
- **Cream** (#f5f5dc) - Warmth and sophistication  
- **Deep Green** (#1b5e3e) - Tradition and premium quality

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mybrand/
├── app/
│   ├── page.tsx              # Home page
│   ├── shop/
│   │   └── page.tsx          # Shop page
│   ├── product/[id]/
│   │   └── page.tsx          # Product detail page
│   ├── cart/
│   │   └── page.tsx          # Cart page
│   ├── checkout/
│   │   └── page.tsx         # Checkout page
│   ├── about/
│   │   └── page.tsx         # About page
│   ├── contact/
│   │   └── page.tsx         # Contact page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx            # Footer component
│   ├── HeroSection.tsx      # Hero section
│   ├── ProductCard.tsx       # Product card component
│   ├── CategoryCard.tsx     # Category card component
│   ├── TestimonialCard.tsx   # Testimonial card
│   ├── FilterSidebar.tsx    # Filter sidebar
│   ├── CartItem.tsx         # Cart item component
│   └── ReviewSection.tsx    # Review section
├── lib/
│   ├── store.ts             # Zustand cart store
│   ├── data.ts              # Mock product data
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## Features Implemented

✅ Responsive design (mobile, tablet, desktop)  
✅ Product listing with filters and search  
✅ Shopping cart with persistence  
✅ Checkout flow  
✅ Product reviews system  
✅ Animations with Framer Motion  
✅ Component-based architecture  
✅ TypeScript for type safety  

## Notes

- Product images use placeholder services. Replace with actual images in production.
- Cart state persists using Zustand with localStorage.
- Checkout is a mock implementation - integrate with a payment gateway for production.

## License

MIT

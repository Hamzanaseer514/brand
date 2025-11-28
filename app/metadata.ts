import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aandnscents.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
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
};

export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Product' | 'LocalBusiness', data?: any) {
  const baseStructuredData: any = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  if (type === 'Organization' || type === 'LocalBusiness') {
    return {
      ...baseStructuredData,
      name: 'A & N Premium Perfumes',
      founder: {
        '@type': 'Person',
        name: 'Rana Nouman',
      },
      url: baseUrl,
      logo: `${baseUrl}/images/1.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+92-347-4566501',
        contactType: 'Customer Service',
        email: 'aandnscents@gmail.com',
        areaServed: 'PK',
        availableLanguage: 'en',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Mohala qilla near govt girls high school more sambrial',
        addressLocality: 'Sialkot',
        addressCountry: 'PK',
      },
      sameAs: [
        // Add social media links when available
      ],
    };
  }

  if (type === 'WebSite') {
    return {
      ...baseStructuredData,
      name: 'A & N Premium Perfumes',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/shop?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  if (type === 'Product' && data) {
    return {
      ...baseStructuredData,
      name: data.name,
      description: data.description,
      image: data.image ? (data.image.startsWith('http') ? data.image : `${baseUrl}${data.image}`) : `${baseUrl}/images/1.png`,
      brand: {
        '@type': 'Brand',
        name: 'A & N',
      },
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'PKR',
        availability: data.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${baseUrl}/product/${data.id}`,
      },
      aggregateRating: data.rating ? {
        '@type': 'AggregateRating',
        ratingValue: data.rating,
        reviewCount: data.reviewsCount || 0,
      } : undefined,
    };
  }

  return baseStructuredData;
}


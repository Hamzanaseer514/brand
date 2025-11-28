import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aandnscents.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Fetch products dynamically for sitemap
  try {
    const productsResponse = await fetch(`${apiUrl}/api/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      if (Array.isArray(products)) {
        const productRoutes = products.map((product: any) => ({
          url: `${baseUrl}/product/${product.id || product._id}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
        routes.push(...productRoutes);
      }
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    // Continue without product routes if API fails
  }

  return routes;
}

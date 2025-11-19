import { readData, writeData, initializeDatabase } from './database.js';

// Helper function to get placeholder image
const getPlaceholderImage = (index) => {
  const imageIndex = (index % 10) + 1;
  return `/images/${imageIndex}.png`;
};

// Seed initial data
export const seedInitialData = async () => {
  await initializeDatabase();

  // Check if products already exist
  const existingProducts = await readData('products.json');
  if (existingProducts && existingProducts.length > 0) {
    console.log('Data already exists, skipping seed...');
    return;
  }

  // Seed products
  const initialProducts = [
    {
      id: '1',
      name: 'Royal Oud',
      description: 'A luxurious blend of rare oud wood, amber, and musk creating an opulent and mysterious fragrance.',
      price: 299.99,
      image: getPlaceholderImage(0),
      images: [getPlaceholderImage(0), getPlaceholderImage(1), getPlaceholderImage(0)],
      category: 'Woody',
      fragranceType: 'Oriental',
      fragranceNotes: ['Oud', 'Amber', 'Musk', 'Sandalwood'],
      rating: 4.8,
      reviewsCount: 127,
      inStock: true,
      size: '50ml',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Arabian Nights',
      description: 'An exotic composition of rose, jasmine, and saffron with a base of vanilla and oud.',
      price: 249.99,
      image: getPlaceholderImage(1),
      images: [getPlaceholderImage(1), getPlaceholderImage(0)],
      category: 'Floral',
      fragranceType: 'Floral Oriental',
      fragranceNotes: ['Rose', 'Jasmine', 'Saffron', 'Vanilla', 'Oud'],
      rating: 4.7,
      reviewsCount: 89,
      inStock: true,
      size: '50ml',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Desert Bloom',
      description: 'Fresh and vibrant with notes of citrus, mint, and lavender, finished with white musk.',
      price: 179.99,
      image: getPlaceholderImage(2),
      images: [getPlaceholderImage(2)],
      category: 'Fresh',
      fragranceType: 'Fresh',
      fragranceNotes: ['Citrus', 'Mint', 'Lavender', 'White Musk'],
      rating: 4.5,
      reviewsCount: 156,
      inStock: true,
      size: '50ml',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  await writeData('products.json', initialProducts);

  // Seed testimonials
  const initialTestimonials = [
    {
      id: '1',
      name: 'Aisha Rahman',
      rating: 5,
      comment: 'Royal Oud is absolutely divine! The fragrance lasts all day and the quality is exceptional.',
      location: 'Dubai, UAE',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Mohammed Ali',
      rating: 5,
      comment: 'Best ittar collection I have ever purchased. Arabian Nights is my favorite - truly authentic.',
      location: 'London, UK',
      createdAt: new Date().toISOString(),
    },
  ];

  await writeData('testimonials.json', initialTestimonials);

  console.log('✅ Initial data seeded successfully!');
};


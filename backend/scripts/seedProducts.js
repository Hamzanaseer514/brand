import dotenv from 'dotenv';
import ConnectToDB from '../utils/db.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import FragranceType from '../models/FragranceType.js';

dotenv.config();

// Product data with different categories and fragrance types
const productsData = [
  {
    name: 'Royal Oud Premium',
    description: 'A luxurious blend of oud, sandalwood, and cedar. Rich and sophisticated fragrance perfect for evening wear. This premium fragrance combines the finest ingredients to create an unforgettable scent experience.',
    price: 2500,
    category: 'Woody',
    fragranceType: 'Oriental',
    fragranceNotes: ['Oud', 'Amber', 'Musk', 'Sandalwood'],
    size: '50ml',
    discount: 0,
    inStock: true,
  },
  {
    name: 'Rose Petals Delight',
    description: 'Delicate rose fragrance with hints of jasmine and lily. Feminine and romantic. Perfect for special occasions and daily wear. This floral masterpiece captures the essence of a blooming garden.',
    price: 1900,
    category: 'Floral',
    fragranceType: 'Floral',
    fragranceNotes: ['Rose', 'Jasmine', 'Lily', 'Vanilla'],
    size: '50ml',
    discount: 10,
    inStock: true,
  },
  {
    name: 'Amber Royal Essence',
    description: 'Rich amber with vanilla and spices. Warm and sensual. This captivating fragrance is perfect for those who love deep, luxurious scents that last all day.',
    price: 2600,
    category: 'Amber',
    fragranceType: 'Oriental',
    fragranceNotes: ['Amber', 'Vanilla', 'Spices', 'Patchouli'],
    size: '50ml',
    discount: 0,
    inStock: true,
  },
  {
    name: 'Sandalwood Classic',
    description: 'Pure sandalwood fragrance with hints of vanilla and musk. Classic and timeless. A sophisticated scent that never goes out of style.',
    price: 1800,
    category: 'Woody',
    fragranceType: 'Woody',
    fragranceNotes: ['Sandalwood', 'Vanilla', 'Musk', 'Patchouli'],
    size: '50ml',
    discount: 15,
    inStock: true,
  },
  {
    name: 'Jasmine Bloom Luxury',
    description: 'Pure jasmine essence with white floral notes. Fresh and uplifting. This elegant fragrance brings the beauty of jasmine gardens to your daily routine.',
    price: 2100,
    category: 'Floral',
    fragranceType: 'Floral',
    fragranceNotes: ['Jasmine', 'White Flowers', 'Gardenia', 'Musk'],
    size: '50ml',
    discount: 0,
    inStock: true,
  },
  {
    name: 'Golden Amber Delight',
    description: 'Golden amber with honey notes. Sweet and luxurious. A warm, inviting fragrance that creates an aura of elegance and sophistication.',
    price: 2300,
    category: 'Amber',
    fragranceType: 'Oriental',
    fragranceNotes: ['Amber', 'Honey', 'Vanilla', 'Musk'],
    size: '50ml',
    discount: 12,
    inStock: true,
  },
  {
    name: 'Cedarwood Fresh',
    description: 'Fresh cedarwood with citrus top notes. Perfect for daytime wear. This invigorating scent brings energy and freshness to your day.',
    price: 2200,
    category: 'Woody',
    fragranceType: 'Fresh',
    fragranceNotes: ['Cedarwood', 'Citrus', 'Bergamot', 'Vetiver'],
    size: '50ml',
    discount: 0,
    inStock: true,
  },
  {
    name: 'Lavender Fields',
    description: 'Calming lavender with herbal notes. Perfect for relaxation. This soothing fragrance helps create a peaceful and serene atmosphere.',
    price: 1700,
    category: 'Floral',
    fragranceType: 'Floral',
    fragranceNotes: ['Lavender', 'Herbs', 'Bergamot', 'Woody Notes'],
    size: '50ml',
    discount: 8,
    inStock: true,
  },
  {
    name: 'Amber Mystique',
    description: 'Mysterious amber with oud and rose. Deep and complex. This intriguing fragrance tells a story of luxury and mystery.',
    price: 2900,
    category: 'Amber',
    fragranceType: 'Oriental',
    fragranceNotes: ['Amber', 'Oud', 'Rose', 'Saffron'],
    size: '50ml',
    discount: 0,
    inStock: true,
  },
  {
    name: 'Gardenia Dreams',
    description: 'Exotic gardenia with tropical notes. Rich and intoxicating. This luxurious fragrance transports you to a tropical paradise with every spray.',
    price: 2400,
    category: 'Floral',
    fragranceType: 'Floral Oriental',
    fragranceNotes: ['Gardenia', 'Tuberose', 'Ylang-Ylang', 'Coconut'],
    size: '50ml',
    discount: 10,
    inStock: true,
  },
];

async function seedProducts() {
  try {
    console.log('🌱 Starting product seeding...\n');

    // Connect to database
    await ConnectToDB();
    console.log('✅ Connected to database\n');

    // Verify categories exist
    const categories = ['Woody', 'Floral', 'Amber'];
    for (const categoryName of categories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      if (!existingCategory) {
        console.log(`⚠️  Warning: Category "${categoryName}" not found. Creating it...`);
        await Category.create({
          name: categoryName,
          description: `${categoryName} fragrance category`,
        });
        console.log(`✅ Created category: ${categoryName}`);
      }
    }

    // Verify fragrance types exist (create if needed)
    const fragranceTypeNames = productsData.map(p => p.fragranceType).filter((v, i, a) => a.indexOf(v) === i);
    for (const fragranceTypeName of fragranceTypeNames) {
      const existingFragranceType = await FragranceType.findOne({ name: fragranceTypeName });
      if (!existingFragranceType) {
        console.log(`⚠️  Warning: Fragrance Type "${fragranceTypeName}" not found. Creating it...`);
        await FragranceType.create({
          name: fragranceTypeName,
          description: `${fragranceTypeName} fragrance type`,
        });
        console.log(`✅ Created fragrance type: ${fragranceTypeName}`);
      }
    }

    console.log('\n📦 Adding products...\n');

    // Add products
    let created = 0;
    let skipped = 0;

    for (const productData of productsData) {
      // Check if product already exists
      const existingProduct = await Product.findOne({ name: productData.name });
      
      if (existingProduct) {
        console.log(`⏭️  Skipped: ${productData.name} (already exists)`);
        skipped++;
        continue;
      }

      // Create product with placeholder image
      const product = await Product.create({
        ...productData,
        image: '/images/1.png', // Placeholder - user will update later
        images: [], // Empty - user will add later
        rating: 0,
        reviewsCount: 0,
      });

      console.log(`✅ Created: ${product.name}`);
      console.log(`   Category: ${product.category} | Fragrance Type: ${product.fragranceType}`);
      console.log(`   Price: Rs ${product.price} | Discount: ${product.discount}%`);
      console.log(`   Fragrance Notes: ${product.fragranceNotes.join(', ')}\n`);
      created++;
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created} products`);
    console.log(`   ⏭️  Skipped: ${skipped} products (already exist)`);
    console.log(`   📦 Total: ${productsData.length} products`);
    console.log('\n✅ Product seeding completed!');
    console.log('ℹ️  Note: Update product images manually through admin panel.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts();

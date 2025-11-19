import dotenv from 'dotenv';
import ConnectToDB from '../utils/db.js';
import Category from '../models/Category.js';

dotenv.config();

async function seedCategories() {
  try {
    console.log('🌱 Seeding default categories...\n');

    // Connect to MongoDB
    await ConnectToDB();

    // Default categories
    const defaultCategories = ['Woody', 'Floral', 'Fresh'];

    for (const categoryName of defaultCategories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      
      if (!existingCategory) {
        const newCategory = new Category({ name: categoryName });
        await newCategory.save();
        console.log(`✅ Created category: ${categoryName}`);
      } else {
        console.log(`ℹ️  Category already exists: ${categoryName}`);
      }
    }

    console.log('\n✅ Categories seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();


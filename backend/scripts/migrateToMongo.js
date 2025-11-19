import dotenv from 'dotenv';
import connectDB from '../utils/db.js';
import { readData } from '../utils/database.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import Testimonial from '../models/Testimonial.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function migrateToMongo() {
  try {
    console.log('🔄 Starting migration from file storage to MongoDB...\n');

    // Connect to MongoDB
    await connectDB();

    // Migrate Products
    console.log('📦 Migrating products...');
    const products = await readData('products.json');
    const productIdMap = {}; // Map old string IDs to new MongoDB ObjectIds
    
    if (products && products.length > 0) {
      // Remove id field and let MongoDB generate _id, but keep track of mapping
      const productsToInsert = products.map(({ id, ...product }) => product);
      const insertedProducts = await Product.insertMany(productsToInsert, { ordered: false });
      
      // Create mapping from old ID to new MongoDB _id
      products.forEach((oldProduct, index) => {
        productIdMap[oldProduct.id] = insertedProducts[index]._id;
      });
      
      console.log(`✅ Migrated ${products.length} products`);
    } else {
      console.log('ℹ️  No products to migrate');
    }

    // Migrate Categories
    console.log('\n📁 Migrating categories...');
    const categories = await readData('categories.json');
    if (categories && Array.isArray(categories)) {
      // Categories are stored as array of strings, convert to objects
      const categoriesToInsert = categories
        .filter((cat) => cat !== 'All') // Skip 'All' category
        .map((name) => ({ name }));
      
      if (categoriesToInsert.length > 0) {
        // Use insertMany with ordered: false to skip duplicates
        try {
          await Category.insertMany(categoriesToInsert, { ordered: false });
          console.log(`✅ Migrated ${categoriesToInsert.length} categories`);
        } catch (error) {
          if (error.code === 11000) {
            console.log('ℹ️  Some categories already exist, skipping duplicates');
          } else {
            throw error;
          }
        }
      } else {
        console.log('ℹ️  No categories to migrate');
      }
    }

    // Migrate Reviews
    console.log('\n⭐ Migrating reviews...');
    const reviews = await readData('reviews.json');
    if (reviews && reviews.length > 0) {
      // Convert reviews with proper ObjectId references using the productIdMap
      const reviewsToInsert = [];
      let skippedCount = 0;
      
      for (const review of reviews) {
        const { id, date, productId, ...reviewData } = review;
        const mongoProductId = productIdMap[productId];
        
        if (mongoProductId) {
          reviewsToInsert.push({
            ...reviewData,
            productId: mongoProductId,
            date: date ? new Date(date) : new Date(),
          });
        } else {
          skippedCount++;
          console.log(`⚠️  Skipping review for productId "${productId}" - product not found in migration`);
        }
      }
      
      if (reviewsToInsert.length > 0) {
        await Review.insertMany(reviewsToInsert, { ordered: false });
        console.log(`✅ Migrated ${reviewsToInsert.length} reviews`);
        if (skippedCount > 0) {
          console.log(`⚠️  Skipped ${skippedCount} reviews with invalid productId references`);
        }
      } else {
        console.log('⚠️  No reviews could be migrated (productId references not found)');
      }
    } else {
      console.log('ℹ️  No reviews to migrate');
    }

    // Migrate Testimonials
    console.log('\n💬 Migrating testimonials...');
    const testimonials = await readData('testimonials.json');
    if (testimonials && testimonials.length > 0) {
      const testimonialsToInsert = testimonials.map(({ id, ...testimonial }) => testimonial);
      await Testimonial.insertMany(testimonialsToInsert, { ordered: false });
      console.log(`✅ Migrated ${testimonials.length} testimonials`);
    } else {
      console.log('ℹ️  No testimonials to migrate');
    }

    // Migrate Orders
    console.log('\n🛒 Migrating orders...');
    const orders = await readData('orders.json');
    if (orders && orders.length > 0) {
      const ordersToInsert = orders.map(({ id, createdAt, updatedAt, ...order }) => ({
        ...order,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
      }));
      await Order.insertMany(ordersToInsert, { ordered: false });
      console.log(`✅ Migrated ${orders.length} orders`);
    } else {
      console.log('ℹ️  No orders to migrate');
    }

    // Migrate Users
    console.log('\n👤 Migrating users...');
    const users = await readData('users.json');
    if (users && users.length > 0) {
      const usersToInsert = users.map(({ id, ...user }) => user);
      try {
        await User.insertMany(usersToInsert, { ordered: false });
        console.log(`✅ Migrated ${users.length} users`);
      } catch (error) {
        if (error.code === 11000) {
          console.log('ℹ️  Some users already exist, skipping duplicates');
        } else {
          throw error;
        }
      }
    } else {
      console.log('ℹ️  No users to migrate');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📝 Note: You can now delete the backend/data folder if you want.');
    console.log('   Make sure to backup your data first!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateToMongo();


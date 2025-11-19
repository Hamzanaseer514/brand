import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

const ConnectToDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/mybrand';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to Database');
  } catch (error) {
    console.error('❌ Error Connecting to DB:', error.message);
  }
};

export default ConnectToDB;


const mongoose = require('mongoose');

/**
 * Database Connection Configuration
 * Connects to MongoDB using Mongoose
 * Fallback to MongoDB Memory Server if local connection fails
 */
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Attempt connection with a short timeout to fail fast if not running
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️  Local MongoDB Connection Failed: ${error.message}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Starting MongoDB Memory Server for development...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        // Create with explicit options if needed
        const mongoServer = await MongoMemoryServer.create({
          instance: {
            dbName: 'maritime_dashboard'
          }
        });
        const mongoUri = mongoServer.getUri();
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB Memory Server (Temporary Storage)');
        console.log(`🔗 URI: ${mongoUri}`);
        console.log('📝 Note: Data will be lost when the server restarts');
      } catch (memError) {
        console.error(`❌ Failed to start MongoDB Memory Server: ${memError.stack}`);
        process.exit(1);
      }
    } else {
      console.error('❌ MongoDB Connection Error. Please ensure MongoDB is running or provide a valid MONGO_URI.');
      process.exit(1);
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;

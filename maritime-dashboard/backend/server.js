require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

/**
 * Server Configuration
 * Entry point for the Maritime Dashboard Backend API
 */

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Run SaaS Migration for existing data
    const migrateToSaaS = require('./src/migrate');
    await migrateToSaaS();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🚀 Maritime Dashboard Backend API');
      console.log('='.repeat(50));
      console.log(`📡 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('⚠️  SIGTERM signal received. Closing server gracefully...');
      server.close(() => {
        console.log('🛑 Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n⚠️  SIGINT signal received. Closing server gracefully...');
      server.close(() => {
        console.log('🛑 Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

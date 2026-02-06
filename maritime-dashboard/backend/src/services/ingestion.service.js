const axios = require('axios');
const Vessel = require('../models/vessel.model');
const Joi = require('joi');

/**
 * PRODUCTION-GRADE AIS INGESTION PIPELINE
 * Responsibility: Fetch, Validate, Normalize, and Stream data.
 */
class IngestionService {
  constructor() {
    // Standard schema for Map Events
    this.eventSchema = Joi.object({
      mmsi: Joi.string().required(),
      lat: Joi.number().min(-90).max(90).required(),
      lon: Joi.number().min(-180).max(180).required(),
      speed: Joi.number().min(0).optional(),
      heading: Joi.number().min(0).max(360).optional(),
      timestamp: Joi.date().default(Date.now),
      vessel_name: Joi.string().optional()
    });
  }

  /**
   * Process incoming raw data from external source
   * @param {Object} rawData - Data from AIS feed
   */
  async processIncomingData(rawData) {
    try {
      // 1. DATA VALIDATION
      const { error, value: normalizedData } = this.eventSchema.validate(rawData);
      if (error) {
        console.error('❌ Data Validation Failed:', error.details);
        return;
      }

      // 2. NORMALIZATION (Standardizing field names etc)
      const vesselUpdate = {
        lastPosition: {
          lat: normalizedData.lat,
          lon: normalizedData.lon,
          speed: normalizedData.speed,
          heading: normalizedData.heading,
          timestamp: normalizedData.timestamp
        }
      };

      // 3. STORAGE & STREAMING 
      // Update MongoDB (Cold Storage)
      const vessel = await Vessel.findOneAndUpdate(
        { mmsi: normalizedData.mmsi },
        vesselUpdate,
        { upsert: false, new: true }
      );

      if (vessel) {
        // 4. HOT STORAGE SYNC (Redis)
        // This will be implemented in the Redis Service call
        console.log(`✅ Position synced for Vessel: ${vessel.name} [${normalizedData.mmsi}]`);
      }

    } catch (err) {
      console.error('❌ Ingestion Pipeline Error:', err.message);
      // Implementation of Retry Logic would go here
    }
  }

  /**
   * Worker loop to fetch from external AIS API
   */
  async startIngestionWorker(apiEndpoint) {
    setInterval(async () => {
      try {
        const response = await axios.get(apiEndpoint);
        const ships = response.data; // Array of ships
        ships.forEach(ship => this.processIncomingData(ship));
      } catch (err) {
        console.error('❌ AIS Feed Error:', err.message);
      }
    }, 60000); // Pulse every minute
  }
}

module.exports = new IngestionService();

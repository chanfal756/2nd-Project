const Redis = require('ioredis');

/**
 * REDIS HOT STORAGE SERVICE
 * Handles high-frequency position updates for real-time map performance.
 */
class RedisService {
  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('⚠️  Redis not found. Real-time hot storage disabled (Falling back to MongoDB).');
          this.isAvailable = false;
          return null; // Stop retrying
        }
        return 5000;
      }
    });
    
    this.isAvailable = true;
    this.client.on('error', (err) => {
      this.isAvailable = false;
      // Suppress noisy error logs in dev if not connected
    });
    this.client.on('connect', () => {
      this.isAvailable = true;
      console.log('📡 Connected to Hot Storage (Redis)');
    });
  }

  /**
   * Store latest position with TTL (Time To Live)
   * @param {String} vesselId 
   * @param {Object} position 
   */
  async updateVesselPosition(vesselId, position) {
    if (!this.isAvailable) return;
    const key = `position:${vesselId}`;
    
    // Store as JSON string with 1 hour TTL (Hot data expires if not updated)
    await this.client.set(key, JSON.stringify(position), 'EX', 3600);
    
    // Optional: Push to a geo-index for radius searches
    await this.client.geoadd('vessels_geo', position.lon, position.lat, vesselId);
  }

  /**
   * Get latest position from Hot Storage
   */
  async getLatestPosition(vesselId) {
    if (!this.isAvailable) return null;
    const data = await this.client.get(`position:${vesselId}`);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get all vessels in a specific area (Geo-Spatial Query)
   */
  async getVesselsInArea(lat, lon, radiusKm) {
    if (!this.isAvailable) return [];
    return await this.client.georadius('vessels_geo', lon, lat, radiusKm, 'km', 'WITHCOORD');
  }
}

module.exports = new RedisService();

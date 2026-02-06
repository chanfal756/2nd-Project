const os = require('os');
const mongoose = require('mongoose');
const redisService = require('../services/redis.service');

/**
 * System Health & Observability Controller
 */
exports.getSystemHealth = async (req, res) => {
  const healthStatus = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    cpu: os.loadavg(),
    memory: {
      free: os.freemem(),
      total: os.totalmem(),
      usage: (1 - os.freemem() / os.totalmem()) * 100
    },
    services: {
      database: mongoose.connection.readyState === 1 ? 'up' : 'down',
      redis: redisService.client.status === 'ready' ? 'up' : 'down'
    }
  };

  res.json({
    success: true,
    data: healthStatus
  });
};

/**
 * Tenant Analytics (Production Metrics)
 */
exports.getTenantMetrics = async (req, res) => {
  // Simulated metrics for latency and usage per tenant
  res.json({
    success: true,
    orgId: req.tenantId,
    metrics: {
      api_latency_ms: Math.floor(Math.random() * 50) + 10,
      map_update_frequency: '15s',
      missing_pings: 2,
      active_vessels: 12
    }
  });
};

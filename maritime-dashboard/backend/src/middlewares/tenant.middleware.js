/**
 * Tenant Middleware for SaaS Data Isolation
 * This middleware ensures that every request is context-aware of its organization.
 */
const tenantMiddleware = (req, res, next) => {
  // 1. Ensure user is authenticated (should be called after protect middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required for tenant context' });
  }

  // 2. Extract orgId from user context
  let orgId = req.user.orgId;

  if (!orgId) {
    // Development Fallback: Assign to default organization if missing
    // In production, this might be handled differently
    const Organization = require('../models/organization.model');
    Organization.findOne({ slug: 'default' }).then(org => {
      if (org) {
        req.user.orgId = org._id;
        req.tenantId = org._id;
        // Optionally update the user record for persistence
        req.user.save().catch(err => console.error('Failed to auto-assign orgId:', err));
        next();
      } else {
        return res.status(403).json({ 
          message: 'User does not belong to any organization and no default found. Access denied.' 
        });
      }
    }).catch(err => {
      return res.status(500).json({ message: 'Error establishing tenant context' });
    });
    return;
  }

  // 3. Inject tenant context into request
  req.tenantId = orgId;
  next();
};

module.exports = tenantMiddleware;

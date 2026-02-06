/**
 * Tenant Middleware for SaaS Data Isolation
 * This middleware ensures that every request is context-aware of its organization.
 */
const tenantMiddleware = (req, res, next) => {
  // 1. Ensure user is authenticated (should be called after protect middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required for tenant context' });
  }

  // 2. Extract orgId from user context (injected by JWT protect middleware)
  const orgId = req.user.orgId;

  if (!orgId) {
    return res.status(403).json({ 
      message: 'User does not belong to any organization. Access denied.' 
    });
  }

  // 3. Inject tenant context into request for use in controllers/services
  // This allows us to do: Vessel.find({ orgId: req.tenantId })
  req.tenantId = orgId;

  // 4. Global query helper (Optional: useful if using a library that supports it)
  // For standard Mongoose, we'll manually pass req.tenantId to services.
  
  next();
};

module.exports = tenantMiddleware;

/**
 * RBAC & Feature Gating Middleware
 * Checks if user has the required permission OR if organization has the required plan.
 */
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const user = req.user;
    
    // Admins bypass everything
    if (user.role === 'admin') {
      return next();
    }

    // Check if user has explicit permission
    const hasPermission = user.permissions && user.permissions.includes(requiredPermission);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Insufficient permissions to access this feature.' 
      });
    }

    next();
  };
};

/**
 * Feature Gating based on Subscription Plan
 */
const requirePlan = (planName) => {
  return (req, res, next) => {
    const orgPlan = req.orgContext?.plan || 'free';
    
    const plans = {
      'free': 0,
      'premium': 1,
      'enterprise': 2
    };

    if (plans[orgPlan] < plans[planName]) {
      return res.status(403).json({ 
        message: `This feature requires a ${planName} subscription.` 
      });
    }

    next();
  };
};

module.exports = { checkPermission, requirePlan };

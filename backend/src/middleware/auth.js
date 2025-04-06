const jwt = require('jsonwebtoken');

// Basic auth middleware
const auth = (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  // Check if user is admin (user_id = 1)
  if (req.userId !== 1) {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
  
  next();
};

module.exports = auth;
module.exports.adminOnly = adminOnly;

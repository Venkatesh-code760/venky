const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { memoryStore, getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No token provided in authorization header'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'travel_planner_secret_jwt_key_2026_xyz');

    if (getIsConnected()) {
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in system' });
      }
      req.user = user;
    } else {
      // Memory store fallback
      const user = memoryStore.users.find(u => u._id.toString() === decoded.id.toString());
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found in session store' });
      }
      const { passwordHash, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      error: err.message
    });
  }
};

module.exports = { protect };

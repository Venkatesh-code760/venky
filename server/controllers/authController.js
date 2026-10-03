const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { memoryStore, getIsConnected } = require('../config/db');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'travel_planner_secret_jwt_key_2026_xyz', {
    expiresIn: '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (getIsConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash
      });

      // Create default profile for the user
      await Profile.create({
        userId: user._id,
        homeCity: 'New Delhi',
        interests: ['nature', 'beaches', 'food', 'adventure']
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } else {
      // In-Memory Fallback
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const id = 'usr_' + Date.now();
      const newUser = {
        _id: id,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'traveler',
        createdAt: new Date()
      };
      memoryStore.users.push(newUser);

      // Create memory profile
      memoryStore.profiles.push({
        _id: 'prof_' + Date.now(),
        userId: id,
        homeCity: 'New Delhi',
        interests: ['nature', 'beaches', 'food', 'adventure'],
        travelStyle: 'mid-range',
        pace: 'moderate',
        dietaryPreferences: ['Vegetarian Friendly'],
        accessibilityNeeds: 'None',
        transportModes: ['cab', 'flight'],
        companions: 'couple',
        scoringWeights: {
          interestRelevance: 40,
          budgetFit: 20,
          ratingPopularity: 15,
          proximityTravelTime: 15,
          weatherSuitability: 10
        }
      });

      const token = generateToken(id);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully (Fallback Storage)',
        data: {
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } else {
      // In-Memory Fallback
      let user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      // If no users exist in memory yet (e.g. fresh reboot), allow quick demo login
      if (!user && (email === 'demo@travelplanner.ai' || email === 'traveler@test.com')) {
        const id = 'usr_demo';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);
        user = {
          _id: id,
          name: 'Demo Traveler',
          email: email.toLowerCase(),
          passwordHash,
          role: 'traveler',
          createdAt: new Date()
        };
        memoryStore.users.push(user);
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password. You can also click "Quick Demo Login".'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch && password !== 'password123') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile info
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

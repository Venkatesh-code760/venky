const Profile = require('../models/Profile');
const User = require('../models/User');
const { memoryStore, getIsConnected } = require('../config/db');

// @desc    Get user's traveller profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsConnected()) {
      let profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = await Profile.create({ userId });
      }
      return res.json({
        success: true,
        data: profile
      });
    } else {
      let profile = memoryStore.profiles.find(p => p.userId.toString() === userId.toString());
      if (!profile) {
        profile = {
          _id: 'prof_' + Date.now(),
          userId,
          homeCity: 'New Delhi',
          ageGroup: '26-35',
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
        };
        memoryStore.profiles.push(profile);
      }
      return res.json({
        success: true,
        data: profile
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user's traveller profile & scoring weights
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const updates = req.body;

    if (getIsConnected()) {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: new Date() },
        { new: true, upsert: true, runValidators: true }
      );

      return res.json({
        success: true,
        message: 'Traveller profile updated successfully',
        data: profile
      });
    } else {
      let profileIndex = memoryStore.profiles.findIndex(p => p.userId.toString() === userId.toString());
      if (profileIndex === -1) {
        const newProf = {
          _id: 'prof_' + Date.now(),
          userId,
          ...updates,
          updatedAt: new Date()
        };
        memoryStore.profiles.push(newProf);
        return res.json({
          success: true,
          message: 'Traveller profile created successfully',
          data: newProf
        });
      }

      memoryStore.profiles[profileIndex] = {
        ...memoryStore.profiles[profileIndex],
        ...updates,
        updatedAt: new Date()
      };

      return res.json({
        success: true,
        message: 'Traveller profile updated successfully',
        data: memoryStore.profiles[profileIndex]
      });
    }
  } catch (error) {
    next(error);
  }
};

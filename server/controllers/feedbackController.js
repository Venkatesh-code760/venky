const Feedback = require('../models/Feedback');
const Profile = require('../models/Profile');
const { memoryStore, getIsConnected } = require('../config/db');

// @desc    Submit like/save/dismiss feedback on places (FR10)
// @route   POST /api/feedback
// @access  Public / Private
exports.submitFeedback = async (req, res, next) => {
  try {
    const { placeId, placeName, action, reason } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (!placeId || !action) {
      return res.status(400).json({
        success: false,
        message: 'Place ID and action (like, save, dismiss) are required'
      });
    }

    // Record feedback
    if (getIsConnected() && userId) {
      await Feedback.create({
        userId,
        placeId,
        placeName: placeName || 'Travel Spot',
        action,
        reason: reason || ''
      });

      // Adaptive learning: If user dismissed due to "Too expensive", increase budgetFit weight
      if (action === 'dismiss' && reason && reason.toLowerCase().includes('expensive')) {
        await Profile.findOneAndUpdate(
          { userId },
          { $inc: { 'scoringWeights.budgetFit': 5, 'scoringWeights.interestRelevance': -5 } }
        );
      }
    } else {
      memoryStore.feedbacks.push({
        _id: 'fb_' + Date.now(),
        userId: userId || 'guest',
        placeId,
        placeName: placeName || 'Travel Spot',
        action,
        reason: reason || '',
        createdAt: new Date()
      });
    }

    return res.json({
      success: true,
      message: `Feedback recorded: ${action.toUpperCase()} successfully registered. Future recommendations will adapt to your preferences.`,
      data: { placeId, action, reason }
    });
  } catch (error) {
    next(error);
  }
};

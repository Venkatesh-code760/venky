const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  homeCity: {
    type: String,
    default: 'Mumbai'
  },
  ageGroup: {
    type: String,
    enum: ['18-25', '26-35', '36-50', '50+'],
    default: '26-35'
  },
  interests: {
    type: [String],
    default: ['nature', 'beaches', 'food', 'adventure']
  },
  travelStyle: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury'],
    default: 'mid-range'
  },
  pace: {
    type: String,
    enum: ['relaxed', 'moderate', 'packed'],
    default: 'moderate'
  },
  dietaryPreferences: {
    type: [String],
    default: ['Vegetarian Friendly']
  },
  accessibilityNeeds: {
    type: String,
    default: 'None'
  },
  transportModes: {
    type: [String],
    default: ['cab', 'flight', 'metro']
  },
  companions: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends'],
    default: 'couple'
  },
  scoringWeights: {
    interestRelevance: { type: Number, default: 40 },
    budgetFit: { type: Number, default: 20 },
    ratingPopularity: { type: Number, default: 15 },
    proximityTravelTime: { type: Number, default: 15 },
    weatherSuitability: { type: Number, default: 10 }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);

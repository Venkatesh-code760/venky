const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Attraction', 'Restaurant', 'Hotel', 'Activity', 'Transport'],
    default: 'Attraction'
  },
  timeSlot: { type: String, required: true }, // e.g. "09:00 AM - 11:30 AM"
  estimatedCost: { type: Number, default: 0 },
  duration: { type: String, default: '2 hours' },
  location: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  matchScore: { type: Number, min: 0, max: 100, default: 85 },
  rationale: { type: String, default: '' },
  alternatives: [
    {
      name: String,
      category: String,
      cost: Number,
      reason: String
    }
  ],
  weatherBackup: {
    suggestedActivity: String,
    condition: String,
    isIndoor: Boolean
  }
});

const ItineraryDaySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: String },
  title: { type: String, default: '' },
  weatherSummary: {
    temp: { type: String, default: '28°C' },
    condition: { type: String, default: 'Sunny' },
    icon: { type: String, default: 'Sun' }
  },
  activities: [ActivitySchema]
});

const BudgetSchema = new mongoose.Schema({
  transport: { type: Number, default: 0 },
  accommodation: { type: Number, default: 0 },
  food: { type: Number, default: 0 },
  activities: { type: Number, default: 0 },
  miscellaneous: { type: Number, default: 0 },
  totalEstimated: { type: Number, default: 0 },
  userBudget: { type: Number, default: 0 },
  difference: { type: Number, default: 0 },
  isOverBudget: { type: Boolean, default: false },
  currency: { type: String, default: 'INR' },
  savingsTip: { type: String, default: '' }
});

const TripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  days: { type: Number, required: true, min: 1, max: 30, default: 3 },
  budget: { type: Number, required: true, min: 1000 },
  travelers: { type: Number, required: true, min: 1, default: 2 },
  interests: {
    type: [String],
    default: ['nature', 'beaches', 'food']
  },
  travelPace: {
    type: String,
    enum: ['relaxed', 'moderate', 'packed'],
    default: 'moderate'
  },
  status: {
    type: String,
    enum: ['Planned', 'On-going', 'Completed'],
    default: 'Planned'
  },
  naturalLanguagePrompt: { type: String, default: '' },
  itineraryDays: [ItineraryDaySchema],
  budgetSummary: BudgetSchema,
  routeCoordinates: [
    {
      name: String,
      lat: Number,
      lng: Number,
      day: Number
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trip', TripSchema);

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: String,
    required: true
  },
  placeName: {
    type: String,
    default: ''
  },
  action: {
    type: String,
    enum: ['like', 'save', 'dismiss'],
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);

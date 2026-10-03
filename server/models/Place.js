const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Attraction', 'Restaurant', 'Hotel', 'Activity', 'Transport'],
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  opening_hours: {
    type: String,
    default: '09:00 AM - 06:00 PM'
  },
  price: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  duration: {
    type: String,
    default: '2 hours'
  },
  tags: {
    type: [String],
    default: []
  },
  url: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Place', PlaceSchema);

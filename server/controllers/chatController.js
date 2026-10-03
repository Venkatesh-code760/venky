const ChatMessage = require('../models/ChatMessage');
const Trip = require('../models/Trip');
const { memoryStore, getIsConnected } = require('../config/db');

// @desc    Process conversation message with AI Travel Assistant (FR9)
// @route   POST /api/chat
// @access  Public / Private dual
exports.handleChatMessage = async (req, res, next) => {
  try {
    const { message, tripId, destination, activeItinerary } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : 'anonymous_traveler';

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    const lowerMsg = message.toLowerCase();
    let reply = '';
    let action = null;
    let suggestedModification = null;

    if (lowerMsg.includes('relax') || lowerMsg.includes('more relaxed') || lowerMsg.includes('slow down')) {
      reply = `I have adjusted the pace for your itinerary! I removed non-essential rush hours, extended lunch by 45 minutes, and recommended an evening sunset lounge instead of a packed tour. Would you like me to update Day 2 accordingly?`;
      action = 'ITINERARY_PACING_ADJUSTED';
      suggestedModification = {
        action: 'PACE_RELAX',
        targetDay: 2,
        adjustment: 'Converted 03:00 PM slot into relaxing beachfront walk and extended lunch time.'
      };
    } else if (lowerMsg.includes('vegetarian') || lowerMsg.includes('vegan') || lowerMsg.includes('pure veg')) {
      reply = `For vegetarian dining in ${destination || 'your destination'}, I recommend checking out 'Navtara Pure Veg Heritage' or 'Saravana Bhavan' near the city center. Both offer 100% vegetarian thalis, dosas, and fresh coconut chutneys with exceptional hygiene ratings!`;
      action = 'VEGETARIAN_RECOMMENDATION';
    } else if (lowerMsg.includes('best time') || lowerMsg.includes('season') || lowerMsg.includes('weather')) {
      reply = `The best time to visit ${destination || 'coastal India'} is between November and March when temperatures hover comfortably between 22°C and 29°C with clear sunny skies and minimal humidity. Perfect for sightseeing and beach activities!`;
      action = 'WEATHER_INSIGHT';
    } else if (lowerMsg.includes('budget') || lowerMsg.includes('cheaper') || lowerMsg.includes('save money')) {
      reply = `To trim trip expenses without sacrificing quality: 1. Hire a two-wheeler/scooter (₹400/day) instead of private cabs (saves ~₹1,500/day). 2. Reserve heritage homestays or boutique hostels. 3. Enjoy fresh coastal thalis at local seaside shacks instead of fine-dining resorts.`;
      action = 'BUDGET_OPTIMIZATION';
    } else if (lowerMsg.includes('rain') || lowerMsg.includes('indoor') || lowerMsg.includes('monsoon')) {
      reply = `If it rains during your trip, don't worry! Your itinerary has automatic weather backups: visit the local State Heritage Museum, enjoy indoor spice plantation tastings, or relax at a traditional Ayurvedic wellness centre.`;
      action = 'WEATHER_BACKUP';
    } else {
      reply = `Great travel query! Based on your ${destination ? destination + ' ' : ''}preferences, I have optimized your itinerary route to minimize commute time and maximize cultural immersion. Feel free to ask me for dining spots, hidden gems, or pace adjustments!`;
      action = 'GENERAL_ASSISTANCE';
    }

    // Persist to DB or Memory if user is authenticated
    if (req.user) {
      if (getIsConnected()) {
        await ChatMessage.create({
          tripId: tripId || 'general',
          userId: req.user._id || req.user.id,
          role: 'user',
          content: message
        });
        await ChatMessage.create({
          tripId: tripId || 'general',
          userId: req.user._id || req.user.id,
          role: 'assistant',
          content: reply
        });
      } else {
        memoryStore.chatMessages.push(
          { tripId: tripId || 'general', role: 'user', content: message, createdAt: new Date() },
          { tripId: tripId || 'general', role: 'assistant', content: reply, createdAt: new Date() }
        );
      }
    }

    return res.json({
      success: true,
      data: {
        reply,
        action,
        suggestedModification,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

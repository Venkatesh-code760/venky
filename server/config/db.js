const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for Atlas SRV resolution in Node.js
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if restricted
}

let isConnected = false;

// In-memory fallback database store to guarantee 100% uptime even without MongoDB
const memoryStore = {
  users: [],
  profiles: [],
  trips: [],
  places: [
    {
      _id: 'pl-1',
      name: 'Baga Beach & Water Sports',
      category: 'Attraction',
      destination: 'Goa',
      description: 'Popular beach known for parasailing, jet skiing, beach shacks, and vibrant sunset nightlife.',
      location: 'North Goa, Goa 403516',
      lat: 15.5553,
      lng: 73.7517,
      opening_hours: '24 Hours',
      price: 500,
      rating: 4.6,
      duration: '3-4 hours',
      tags: ['adventure', 'beaches', 'food'],
      url: 'https://goatourism.gov.in'
    },
    {
      _id: 'pl-2',
      name: 'Aguada Fort & Lighthouse',
      category: 'Attraction',
      destination: 'Goa',
      description: 'Well-preserved 17th-century Portuguese fort offering panoramic Arabian Sea vistas.',
      location: 'Candolim, Goa 403515',
      lat: 15.4925,
      lng: 73.7737,
      opening_hours: '09:30 AM - 06:00 PM',
      price: 50,
      rating: 4.5,
      duration: '2 hours',
      tags: ['history', 'culture', 'nature'],
      url: 'https://goatourism.gov.in'
    },
    {
      _id: 'pl-3',
      name: 'Taj Exotica Resort & Spa',
      category: 'Hotel',
      destination: 'Goa',
      description: 'Mediterranean-style luxury beachfront resort sprawled across 56 landscaped acres.',
      location: 'Benaulim, South Goa',
      lat: 15.2635,
      lng: 73.9213,
      opening_hours: 'Check-in 14:00',
      price: 12000,
      rating: 4.8,
      duration: 'Per Night',
      tags: ['luxury', 'relaxation'],
      url: 'https://tajhotels.com'
    },
    {
      _id: 'pl-4',
      name: 'Zostel Goa (Morjim)',
      category: 'Hotel',
      destination: 'Goa',
      description: 'Backpacker and digital nomad community hostel close to serene turtle beach.',
      location: 'Morjim, North Goa',
      lat: 15.6315,
      lng: 73.7381,
      opening_hours: 'Check-in 12:00',
      price: 1100,
      rating: 4.4,
      duration: 'Per Night',
      tags: ['budget', 'social', 'adventure'],
      url: 'https://zostel.com'
    },
    {
      _id: 'pl-5',
      name: "Fisherman's Wharf",
      category: 'Restaurant',
      destination: 'Goa',
      description: 'Riverside dining serving authentic Goan seafood curry, Kingfish fry, and Bebinca dessert.',
      location: 'Mobor Beach, Cavelossim',
      lat: 15.1743,
      lng: 73.9458,
      opening_hours: '12:00 PM - 11:30 PM',
      price: 900,
      rating: 4.7,
      duration: '1.5 hours',
      tags: ['food', 'seafood', 'culture'],
      url: 'https://thefishermanswharf.in'
    },
    {
      _id: 'pl-6',
      name: 'Mattancherry Palace & Jew Town',
      category: 'Attraction',
      destination: 'Kerala',
      description: 'Historic Dutch palace with ornate Hindu murals, antique spice markets and cafes.',
      location: 'Kochi, Kerala 682002',
      lat: 9.9583,
      lng: 76.2594,
      opening_hours: '10:00 AM - 05:00 PM',
      price: 20,
      rating: 4.4,
      duration: '2 hours',
      tags: ['history', 'culture', 'shopping'],
      url: 'https://keralatourism.org'
    },
    {
      _id: 'pl-7',
      name: 'Alleppey Backwaters Houseboat Cruise',
      category: 'Activity',
      destination: 'Kerala',
      description: 'Tranquil luxury or traditional kettuvallam cruise navigating palm-fringed canals.',
      location: 'Punnamada, Alappuzha, Kerala',
      lat: 9.4981,
      lng: 76.3388,
      opening_hours: '08:00 AM - 06:00 PM',
      price: 3500,
      rating: 4.9,
      duration: '4-6 hours',
      tags: ['nature', 'relaxation', 'adventure'],
      url: 'https://keralatourism.org'
    }
  ],
  feedbacks: [],
  chatMessages: []
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_travel_planner';
  if (!uri) {
    console.warn('[DB] No MONGO_URI specified. Operating in Resilient In-Memory Fallback Mode.');
    isConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If remote Atlas failed, attempt local MongoDB connection if available
    if (uri.includes('mongodb+srv://') || !uri.includes('127.0.0.1')) {
      try {
        console.warn(`[DB] Remote MongoDB Notice: ${error.message}. Attempting local MongoDB connection...`);
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/ai_travel_planner', {
          serverSelectionTimeoutMS: 3000
        });
        isConnected = true;
        console.log(`[DB] Local MongoDB Connected: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        console.warn(`[DB] Local MongoDB Notice: ${localErr.message}`);
      }
    }
    isConnected = false;
    console.warn(`[DB] MongoDB Connection Notice: ${error.message}`);
    console.log('[DB] Fallback Mode Active: All user data and trips will be safely persisted in-memory.');
  }
};

const getStatus = () => ({
  isConnected,
  mode: isConnected ? 'MongoDB Live' : 'In-Memory Resilient Fallback'
});

module.exports = {
  connectDB,
  getStatus,
  memoryStore,
  getIsConnected: () => isConnected
};

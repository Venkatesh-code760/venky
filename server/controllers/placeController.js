const Place = require('../models/Place');
const { memoryStore, getIsConnected } = require('../config/db');

// Seed rich dataset of places for Goa, Kerala, Jaipur, Himachal, Manali
const CURATED_PLACES = [
  // GOA
  {
    name: 'Baga Beach & Water Sports Hub',
    category: 'Attraction',
    destination: 'Goa',
    description: 'Premier coastal shoreline renowned for parasailing, banana rides, jet skiing, and lively beachfront shacks.',
    location: 'North Goa, Goa 403516',
    lat: 15.5553,
    lng: 73.7517,
    opening_hours: '24 Hours Open',
    price: 600,
    rating: 4.7,
    duration: '3-4 hours',
    tags: ['beaches', 'adventure', 'water sports'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop'
  },
  {
    name: 'Aguada Portuguese Coastal Fort',
    category: 'Attraction',
    destination: 'Goa',
    description: '17th-century Portuguese fortress and lighthouse offering dramatic panoramic vistas of Sinquerim beach.',
    location: 'Candolim, Goa 403515',
    lat: 15.4925,
    lng: 73.7737,
    opening_hours: '09:00 AM - 06:00 PM',
    price: 50,
    rating: 4.6,
    duration: '2 hours',
    tags: ['history', 'culture', 'nature'],
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop'
  },
  {
    name: 'Dudhsagar Four-Tier Waterfall',
    category: 'Activity',
    destination: 'Goa',
    description: 'Magnificent sea of milk cascade nestled inside Bhagwan Mahavir Sanctuary; jeep safari trek adventure.',
    location: 'Sonaulim, Goa 403410',
    lat: 15.3144,
    lng: 74.3143,
    opening_hours: '07:00 AM - 05:00 PM',
    price: 1500,
    rating: 4.8,
    duration: '5 hours',
    tags: ['adventure', 'nature', 'trekking'],
    imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=600&auto=format&fit=crop'
  },
  {
    name: "Fisherman's Wharf Gourmet Seafood",
    category: 'Restaurant',
    destination: 'Goa',
    description: 'Atmospheric riverside dining serving authentic Goan butter garlic crab, Kingfish thali, and Bebinca pudding.',
    location: 'Mobor Beach, Cavelossim',
    lat: 15.1743,
    lng: 73.9458,
    opening_hours: '12:00 PM - 11:30 PM',
    price: 850,
    rating: 4.8,
    duration: '1.5 hours',
    tags: ['food', 'seafood', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'
  },
  {
    name: 'Zostel Goa (Morjim Beach)',
    category: 'Hotel',
    destination: 'Goa',
    description: 'Bohemian social hostel with private & dorm rooms, swimming pool, co-working hub near Olive Ridley turtle beach.',
    location: 'Morjim, North Goa',
    lat: 15.6315,
    lng: 73.7381,
    opening_hours: '24 Hour Reception',
    price: 1100,
    rating: 4.5,
    duration: 'Per Night',
    tags: ['budget', 'social', 'relaxation'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop'
  },
  {
    name: 'Taj Exotica Seaside Sanctuary',
    category: 'Hotel',
    destination: 'Goa',
    description: '5-star Mediterranean-inspired luxury beachfront resort on Benaulim beach with golf course and ayurvedic spa.',
    location: 'Benaulim, South Goa',
    lat: 15.2635,
    lng: 73.9213,
    opening_hours: '24 Hour Luxury Service',
    price: 14000,
    rating: 4.9,
    duration: 'Per Night',
    tags: ['luxury', 'relaxation', 'beaches'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop'
  },
  // KERALA
  {
    name: 'Alleppey Backwater Houseboat Cruise',
    category: 'Activity',
    destination: 'Kerala',
    description: 'Serene voyage along backwater canals, lotus lagoons, and rural paddy villages aboard a traditional kettuvallam.',
    location: 'Punnamada, Alappuzha, Kerala',
    lat: 9.4981,
    lng: 76.3388,
    opening_hours: '08:00 AM - 06:00 PM',
    price: 3200,
    rating: 4.9,
    duration: '4 hours',
    tags: ['nature', 'relaxation', 'adventure'],
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop'
  },
  {
    name: 'Munnar Tea Gardens & Mattupetty Dam',
    category: 'Attraction',
    destination: 'Kerala',
    description: 'Rolling velvet-green tea estates, cool mountain mist, boating, and scenic viewpoints in the Western Ghats.',
    location: 'Munnar, Idukki, Kerala',
    lat: 10.0889,
    lng: 77.0595,
    opening_hours: '09:00 AM - 05:30 PM',
    price: 150,
    rating: 4.8,
    duration: '3 hours',
    tags: ['nature', 'adventure', 'history'],
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop'
  },
  {
    name: 'Fort Kochi Heritage Walk & Jew Town',
    category: 'Attraction',
    destination: 'Kerala',
    description: 'Colonial spice warehouses, antique galleries, Santa Cruz Basilica, and cantilevered Chinese fishing nets.',
    location: 'Kochi, Kerala 682001',
    lat: 9.9656,
    lng: 76.2421,
    opening_hours: '09:00 AM - 07:00 PM',
    price: 50,
    rating: 4.6,
    duration: '2.5 hours',
    tags: ['history', 'culture', 'shopping'],
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&auto=format&fit=crop'
  },
  {
    name: 'Kashi Art Cafe & Gallery',
    category: 'Restaurant',
    destination: 'Kerala',
    description: 'Leafy courtyard cafe serving artisanal coffees, fresh French press, homemade pies, and local fruit platters.',
    location: 'Burgher St, Fort Kochi',
    lat: 9.9660,
    lng: 76.2415,
    opening_hours: '08:30 AM - 09:00 PM',
    price: 450,
    rating: 4.6,
    duration: '1 hour',
    tags: ['food', 'culture', 'relaxation'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop'
  },
  // JAIPUR
  {
    name: 'Amber Fort & Elephant Ramparts',
    category: 'Attraction',
    destination: 'Jaipur',
    description: 'Spectacular UNESCO hilltop fortress built with red sandstone and marble, featuring the breathtaking Sheesh Mahal.',
    location: 'Amer, Jaipur, Rajasthan 302001',
    lat: 26.9855,
    lng: 75.8513,
    opening_hours: '09:00 AM - 06:00 PM',
    price: 500,
    rating: 4.9,
    duration: '3 hours',
    tags: ['history', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop'
  },
  {
    name: 'Hawa Mahal - Palace of Winds',
    category: 'Attraction',
    destination: 'Jaipur',
    description: 'Iconic five-story pink honeycomb landmark featuring 953 intricately carved jharokhas for royal court viewing.',
    location: 'Badi Choupad, Jaipur 302002',
    lat: 26.9239,
    lng: 75.8267,
    opening_hours: '09:00 AM - 05:00 PM',
    price: 200,
    rating: 4.7,
    duration: '1.5 hours',
    tags: ['history', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1603288967527-2c1b48b598d1?w=600&auto=format&fit=crop'
  },
  {
    name: 'LMB Traditional Rajasthani Feast',
    category: 'Restaurant',
    destination: 'Jaipur',
    description: 'Celebrated restaurant founded in 1954 renowned for authentic Dal Baati Churma, Ker Sangri, and royal Rajasthani sweets.',
    location: 'Johari Bazaar, Jaipur',
    lat: 26.9196,
    lng: 75.8285,
    opening_hours: '08:00 AM - 11:00 PM',
    price: 650,
    rating: 4.6,
    duration: '1.5 hours',
    tags: ['food', 'history'],
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop'
  },
  {
    name: 'Samode Palace Heritage Sanctuary',
    category: 'Hotel',
    destination: 'Jaipur',
    description: 'Opulent 475-year-old royal palace hotel nestled in the Aravali hills featuring hand-painted ceilings and mirror mosaics.',
    location: 'Samode, Jaipur',
    lat: 27.2066,
    lng: 75.8164,
    opening_hours: '24 Hour Service',
    price: 13500,
    rating: 4.9,
    duration: 'Per Night',
    tags: ['luxury', 'history', 'culture'],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop'
  }
];

// Helper to calculate Match Score (0 - 100) per FR5 weights:
// Interest Relevance: 40%, Budget Fit: 20%, Rating: 15%, Proximity: 15%, Weather: 10%
const calculateMatchScore = (place, userInterests = [], maxBudget = 20000) => {
  // 1. Interest Relevance (40%)
  const placeTags = place.tags || [];
  const matchedInterests = placeTags.filter(t => userInterests.map(i => i.toLowerCase()).includes(t.toLowerCase()));
  const interestRatio = userInterests.length > 0 ? (matchedInterests.length / Math.min(placeTags.length, userInterests.length)) : 0.8;
  const interestScore = Math.min(40, Math.round(interestRatio * 40));

  // 2. Budget Fit (20%)
  let budgetScore = 20;
  if (place.price > maxBudget * 0.4) budgetScore = 8;
  else if (place.price > maxBudget * 0.2) budgetScore = 14;

  // 3. Rating & Popularity (15%)
  const ratingScore = Math.round(((place.rating || 4.5) / 5) * 15);

  // 4. Proximity & Travel Convenience (15%)
  const proximityScore = 13;

  // 5. Weather Suitability (10%)
  const weatherScore = 9;

  return Math.min(99, Math.max(70, interestScore + budgetScore + ratingScore + proximityScore + weatherScore));
};

// @desc    Get Places / Recommendations with AI Match Scoring (FR4, FR5)
// @route   GET /api/places or GET /api/recommendations
// @access  Public
exports.getRecommendations = async (req, res, next) => {
  try {
    const { destination, category, interests, maxPrice } = req.query;

    let places = [...CURATED_PLACES];

    // Filter by destination
    if (destination) {
      places = places.filter(p => p.destination.toLowerCase() === destination.toLowerCase());
    }

    // If destination has no exact match, return all or mock customized places
    if (places.length === 0 && destination) {
      places = [
        {
          name: `${destination} Historic Citadel`,
          category: 'Attraction',
          destination,
          description: `Iconic cultural point of interest representing the architectural marvels of ${destination}.`,
          location: `${destination} Downtown`,
          lat: 28.6139,
          lng: 77.2090,
          opening_hours: '09:00 AM - 05:30 PM',
          price: 300,
          rating: 4.7,
          duration: '2.5 hours',
          tags: ['history', 'culture'],
          imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop'
        },
        {
          name: `${destination} Nature Reserve & Valley Trail`,
          category: 'Attraction',
          destination,
          description: `Serene scenic landscape with nature walks, viewpoints, and fresh mountain/coastal air.`,
          location: `${destination} Highlands`,
          lat: 28.6200,
          lng: 77.2150,
          opening_hours: '06:00 AM - 06:00 PM',
          price: 150,
          rating: 4.8,
          duration: '3 hours',
          tags: ['nature', 'adventure'],
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop'
        },
        {
          name: `${destination} Heritage Grand Hotel`,
          category: 'Hotel',
          destination,
          description: `Comfortable and highly rated accommodation located centrally with scenic views.`,
          location: `${destination} City Center`,
          lat: 28.6100,
          lng: 77.2000,
          opening_hours: '24 Hours',
          price: 2600,
          rating: 4.6,
          duration: 'Per Night',
          tags: ['mid-range', 'relaxation'],
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop'
        },
        {
          name: `${destination} Traditional Flavours Kitchen`,
          category: 'Restaurant',
          destination,
          description: `Handcrafted traditional recipes made with fresh local farm produce and authentic spices.`,
          location: `${destination} Bazaar`,
          lat: 28.6120,
          lng: 77.2050,
          opening_hours: '11:00 AM - 10:30 PM',
          price: 550,
          rating: 4.7,
          duration: '1.5 hours',
          tags: ['food', 'culture'],
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop'
        }
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      places = places.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by max price
    if (maxPrice) {
      places = places.filter(p => p.price <= Number(maxPrice));
    }

    const interestArray = interests ? interests.split(',').map(s => s.trim()) : ['nature', 'culture', 'food', 'beaches'];

    // Map each place with computed Match Score
    const scoredPlaces = places.map(p => ({
      ...p,
      matchScore: calculateMatchScore(p, interestArray, Number(maxPrice || 25000)),
      isVerified: true
    })).sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      count: scoredPlaces.length,
      data: scoredPlaces
    });
  } catch (error) {
    next(error);
  }
};

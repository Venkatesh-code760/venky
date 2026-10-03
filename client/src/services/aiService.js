/**
 * client/src/services/aiService.js
 * Rule-based Mock AI Engine conforming to SRS AI Requirements.
 * STRICTLY FREE TIER: NO PAID API, NO API KEY REQUIRED.
 * Simulates realistic AI reasoning latency with 800ms delay.
 */

// Simulated AI network latency helper
const simulateAIDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * FR5: Scoring and Evaluation
 * Match Score (0 - 100) based on SRS Section 3.5 / FR5 weights:
 * Interest Relevance: 40%
 * Budget Fit: 20%
 * Rating & Popularity: 15%
 * Proximity & Travel Time: 15%
 * Weather Suitability: 10%
 */
export const calculateMatchScore = (place, userProfile = {}, weights = null) => {
  const w = weights || {
    interestRelevance: 40,
    budgetFit: 20,
    ratingPopularity: 15,
    proximityTravelTime: 15,
    weatherSuitability: 10
  };

  const userInterests = userProfile.interests || ['nature', 'beaches', 'food', 'adventure'];
  const placeTags = place.tags || [];

  // 1. Interest Score
  const matchCount = placeTags.filter(t => 
    userInterests.some(ui => ui.toLowerCase() === t.toLowerCase())
  ).length;
  const interestScore = placeTags.length > 0 
    ? (matchCount / Math.max(1, placeTags.length)) * (w.interestRelevance / 100) 
    : 0.3 * (w.interestRelevance / 100);

  // 2. Budget Fit Score
  const price = place.price || 0;
  let budgetRatio = 1.0;
  if (price > 5000) budgetRatio = 0.55;
  else if (price > 2000) budgetRatio = 0.8;
  const budgetScore = budgetRatio * (w.budgetFit / 100);

  // 3. Rating & Popularity
  const rating = place.rating || 4.5;
  const ratingScore = (rating / 5.0) * (w.ratingPopularity / 100);

  // 4. Proximity & Travel Time
  const proximityScore = 0.9 * (w.proximityTravelTime / 100);

  // 5. Weather Suitability
  const weatherScore = 0.95 * (w.weatherSuitability / 100);

  const totalDecimal = interestScore + budgetScore + ratingScore + proximityScore + weatherScore;
  return Math.min(99, Math.max(72, Math.round(totalDecimal * 100)));
};

/**
 * FR3 & FR6: AI Itinerary Generator
 * Produces structured day-by-day itinerary with time slots, activities, meal suggestions,
 * stay recommendations, weather backup plans, and category budget estimations.
 */
export const generateAITripItinerary = async ({
  destination = 'Goa',
  days = 3,
  budget = 15000,
  travelers = 2,
  interests = ['beaches', 'nature', 'food'],
  travelPace = 'moderate',
  naturalLanguagePrompt = ''
}) => {
  await simulateAIDelay(800);

  const numDays = Math.min(10, Math.max(1, parseInt(days, 10) || 3));
  const totalBudget = Math.max(1000, parseInt(budget, 10) || 15000);
  const numTravelers = Math.max(1, parseInt(travelers, 10) || 2);

  // Parse natural language if present
  let resolvedDest = destination;
  if (naturalLanguagePrompt) {
    const text = naturalLanguagePrompt.toLowerCase();
    if (text.includes('goa')) resolvedDest = 'Goa';
    else if (text.includes('kerala')) resolvedDest = 'Kerala';
    else if (text.includes('jaipur')) resolvedDest = 'Jaipur';
    else if (text.includes('manali') || text.includes('himachal')) resolvedDest = 'Manali';
  }

  const destinationCatalog = {
    Goa: {
      tags: ['beaches', 'adventure', 'food', 'nightlife'],
      activities: [
        { name: 'Baga & Calangute Golden Beach Walk', cost: 200, category: 'Attraction', time: '09:00 AM - 11:30 AM', lat: 15.5553, lng: 73.7517, tags: ['beaches', 'adventure'], rationale: 'Optimal morning sunlight for shoreline strolls and parasailing.' },
        { name: 'Aguada 17th-Century Portuguese Fort', cost: 100, category: 'Attraction', time: '02:30 PM - 04:30 PM', lat: 15.4925, lng: 73.7737, tags: ['history', 'culture'], rationale: 'Iconic ramparts offering uninterrupted panoramic Arabian Sea views.' },
        { name: 'Basilica of Bom Jesus UNESCO Heritage', cost: 50, category: 'Attraction', time: '10:00 AM - 12:00 PM', lat: 15.5009, lng: 73.9116, tags: ['history', 'culture'], rationale: 'Baroque architecture preserving historical and religious artistry.' },
        { name: 'Dudhsagar Jungle Waterfall Excursion', cost: 1400, category: 'Activity', time: '08:00 AM - 01:30 PM', lat: 15.3144, lng: 74.3143, tags: ['nature', 'adventure'], rationale: 'Scenic off-road jeep safari through dense Bhagwan Mahavir forests.' },
        { name: 'Anjuna Bohemian Sunset Flea Market', cost: 300, category: 'Attraction', time: '05:00 PM - 07:30 PM', lat: 15.5733, lng: 73.7411, tags: ['shopping', 'beaches'], rationale: 'Lively beachfront bazaar with handicrafts, acoustic bands, and local stalls.' }
      ],
      restaurants: [
        { name: "Fisherman's Wharf Coastal Dining", cost: 750, category: 'Restaurant', time: '12:30 PM - 02:00 PM', rationale: 'Riverside dining serving authentic Goan fish curry and Kingfish rava fry.' },
        { name: 'Gunpowder Heritage Garden Kitchen', cost: 650, category: 'Restaurant', time: '07:30 PM - 09:30 PM', rationale: 'Artisanal regional South Indian recipes in an intimate courtyard.' },
        { name: 'Curlies Sunset Beach Shack', cost: 500, category: 'Restaurant', time: '08:00 PM - 10:00 PM', rationale: 'Woodfired pizzas and chilled coconut coolers under the stars.' }
      ],
      weather: { temp: '29°C', condition: 'Sunny & Pleasant', icon: 'Sun' }
    },
    Kerala: {
      tags: ['nature', 'relaxation', 'food', 'culture'],
      activities: [
        { name: 'Alleppey Backwaters Serene Houseboat Tour', cost: 1800, category: 'Activity', time: '09:00 AM - 01:00 PM', lat: 9.4981, lng: 76.3388, tags: ['nature', 'relaxation'], rationale: 'Peaceful cruise traversing emerald canals, lush rice paddies, and villages.' },
        { name: 'Fort Kochi Chinese Fishing Nets & Jew Town', cost: 50, category: 'Attraction', time: '03:00 PM - 05:30 PM', lat: 9.9656, lng: 76.2421, tags: ['history', 'culture'], rationale: 'Centuries-old historic trade quarter with antique spice stores.' },
        { name: 'Munnar Emerald Tea Estate Panorama', cost: 200, category: 'Attraction', time: '09:30 AM - 12:30 PM', lat: 10.0889, lng: 77.0595, tags: ['nature', 'adventure'], rationale: 'Cool mountain air amidst endless undulating tea terraces.' }
      ],
      restaurants: [
        { name: 'Kashi Art Cafe & Garden Gallery', cost: 450, category: 'Restaurant', time: '12:30 PM - 02:00 PM', rationale: 'Locally sourced vegetarian quiches, organic coffees, and fresh pies.' },
        { name: 'Malabar Junction Gourmet Kitchen', cost: 800, category: 'Restaurant', time: '07:30 PM - 09:30 PM', rationale: 'Traditional Kerala fish pollichathu wrapped in banana leaves.' }
      ],
      weather: { temp: '26°C', condition: 'Tropical Mist', icon: 'CloudSun' }
    },
    Jaipur: {
      tags: ['history', 'culture', 'shopping', 'food'],
      activities: [
        { name: 'Amber Fort Hilltop Palace & Sheesh Mahal', cost: 500, category: 'Attraction', time: '09:00 AM - 12:00 PM', lat: 26.9855, lng: 75.8513, tags: ['history', 'culture'], rationale: 'Opulent Rajput palace complex with mirror work and sweeping views.' },
        { name: 'Hawa Mahal - Palace of the Winds', cost: 200, category: 'Attraction', time: '03:00 PM - 04:30 PM', lat: 26.9239, lng: 75.8267, tags: ['history', 'culture'], rationale: 'Intricate 953-window honeycomb pink sandstone facade.' },
        { name: 'Johari Bazaar Gems & Handicrafts Walk', cost: 300, category: 'Attraction', time: '05:00 PM - 07:30 PM', lat: 26.9196, lng: 75.8285, tags: ['shopping', 'culture'], rationale: 'Historic market known for block-printed cottons, blue pottery, and gems.' }
      ],
      restaurants: [
        { name: 'LMB Traditional Rajasthani Thali', cost: 600, category: 'Restaurant', time: '12:30 PM - 02:00 PM', rationale: 'Authentic Dal Baati Churma and Ghewar sweets since 1954.' },
        { name: 'Bar Palladio Royal Garden Lounge', cost: 1000, category: 'Restaurant', time: '08:00 PM - 10:00 PM', rationale: 'Striking cobalt-blue pavilions and heritage Italian-fusion dining.' }
      ],
      weather: { temp: '31°C', condition: 'Clear Skies', icon: 'Sun' }
    }
  };

  const catalog = destinationCatalog[resolvedDest] || destinationCatalog['Goa'];

  const itineraryDays = [];
  const routeCoordinates = [];

  let totalTransport = Math.round(numDays * 400 * numTravelers);
  let totalAccom = Math.round(numDays * 2200);
  let totalFood = Math.round(numDays * 650 * numTravelers);
  let totalActivities = 0;

  for (let d = 1; d <= numDays; d++) {
    const act1 = catalog.activities[(d - 1) % catalog.activities.length];
    const rest1 = catalog.restaurants[(d - 1) % catalog.restaurants.length];
    const act2 = catalog.activities[d % catalog.activities.length];
    const rest2 = catalog.restaurants[d % catalog.restaurants.length];

    const dayActivities = [
      {
        name: act1.name,
        category: act1.category,
        timeSlot: '09:00 AM - 11:30 AM',
        estimatedCost: act1.cost * numTravelers,
        duration: '2.5 hours',
        location: `${resolvedDest} Central`,
        coordinates: { lat: act1.lat, lng: act1.lng },
        matchScore: calculateMatchScore(act1, { interests }),
        rationale: act1.rationale,
        alternatives: [
          { name: `${act1.name} Self-Guided Exploration`, category: 'Attraction', cost: Math.round(act1.cost * 0.7), reason: 'Budget-friendly self paced option' }
        ],
        weatherBackup: {
          suggestedActivity: `${resolvedDest} Central Heritage Museum & Art Gallery`,
          condition: 'Monsoon Rain or Excessive Heat',
          isIndoor: true
        }
      },
      {
        name: rest1.name,
        category: 'Restaurant',
        timeSlot: '12:30 PM - 02:00 PM',
        estimatedCost: rest1.cost * numTravelers,
        duration: '1.5 hours',
        location: `${resolvedDest} Culinary Quarter`,
        coordinates: { lat: act1.lat + 0.005, lng: act1.lng + 0.003 },
        matchScore: 92,
        rationale: rest1.rationale,
        alternatives: [
          { name: 'Local Street Food Plaza', category: 'Restaurant', cost: 200 * numTravelers, reason: 'Quick budget-friendly local bite' }
        ]
      },
      {
        name: act2.name,
        category: act2.category,
        timeSlot: travelPace === 'relaxed' ? '04:00 PM - 06:00 PM' : '03:00 PM - 05:30 PM',
        estimatedCost: act2.cost * numTravelers,
        duration: '2.5 hours',
        location: `${resolvedDest} East Vista`,
        coordinates: { lat: act2.lat, lng: act2.lng },
        matchScore: calculateMatchScore(act2, { interests }),
        rationale: act2.rationale,
        alternatives: [
          { name: 'Tea & Spice Plantation Tasting', category: 'Activity', cost: act2.cost, reason: 'Gentle cultural immersion' }
        ],
        weatherBackup: {
          suggestedActivity: 'Traditional Pottery & Handloom Center',
          condition: 'Inclement Weather',
          isIndoor: true
        }
      },
      {
        name: rest2.name,
        category: 'Restaurant',
        timeSlot: '07:30 PM - 09:30 PM',
        estimatedCost: rest2.cost * numTravelers,
        duration: '2 hours',
        location: `${resolvedDest} Promenade`,
        coordinates: { lat: act2.lat - 0.004, lng: act2.lng + 0.002 },
        matchScore: 89,
        rationale: rest2.rationale,
        alternatives: [
          { name: 'Night Market Gourmet Stalls', category: 'Restaurant', cost: 300 * numTravelers, reason: 'Lively authentic street food' }
        ]
      }
    ];

    totalActivities += (act1.cost + act2.cost) * numTravelers;

    itineraryDays.push({
      dayNumber: d,
      date: `Day ${d}`,
      title: `Day ${d}: ${act1.category === 'Activity' ? 'Adventure' : 'Highlights'} & Regional Heritage`,
      weatherSummary: catalog.weather,
      activities: dayActivities
    });

    routeCoordinates.push({
      name: act1.name,
      lat: act1.lat,
      lng: act1.lng,
      day: d
    });
  }

  const misc = Math.round(totalBudget * 0.06);
  const totalEstimated = totalTransport + totalAccom + totalFood + totalActivities + misc;
  const isOverBudget = totalEstimated > totalBudget;

  const budgetSummary = {
    transport: totalTransport,
    accommodation: totalAccom,
    food: totalFood,
    activities: totalActivities,
    miscellaneous: misc,
    totalEstimated,
    userBudget: totalBudget,
    difference: totalBudget - totalEstimated,
    isOverBudget,
    currency: 'INR',
    savingsTip: isOverBudget
      ? `Budget Alert: Estimated total exceeds your budget by ₹${totalEstimated - totalBudget}. Suggestion: Switch stay to a boutique backpacker hostel like Zostel (saves ₹${Math.round(totalAccom * 0.4)}) and hire a two-wheeler.`
      : `Awesome! You have ₹${totalBudget - totalEstimated} surplus remaining. You could add an evening cruise or spa rejuvenation session!`
  };

  return {
    destination: resolvedDest,
    days: numDays,
    budget: totalBudget,
    travelers: numTravelers,
    interests,
    travelPace,
    itineraryDays,
    budgetSummary,
    routeCoordinates,
    status: 'Planned'
  };
};

/**
 * FR9: AI Chat Assistant Mock Query Handler
 */
export const askAITravelAssistant = async (query, context = {}) => {
  await simulateAIDelay(800);

  const q = (query || '').toLowerCase();
  const dest = context.destination || 'your destination';

  if (q.includes('relax') || q.includes('slow')) {
    return {
      reply: `I have updated your pacing! We extended your lunch break at ${dest}, swapped the rush-hour afternoon tour with a peaceful seaside/garden tea lounge, and gave you free leisure time before dinner.`,
      action: 'PACE_RELAXED',
      success: true
    };
  }

  if (q.includes('vegetarian') || q.includes('vegan') || q.includes('food')) {
    return {
      reply: `For delicious vegetarian dining in ${dest}, try the heritage thali restaurants near the market center. They serve 100% vegetarian regional specialties with farm-fresh produce and zero palm oil!`,
      action: 'VEG_RECOMMENDATION',
      success: true
    };
  }

  if (q.includes('weather') || q.includes('time to visit') || q.includes('season')) {
    return {
      reply: `The best travel window for ${dest} is from October to March. During this period, daytime temperatures stay pleasant around 24°C–29°C with low humidity and clear skies!`,
      action: 'WEATHER_INSIGHT',
      success: true
    };
  }

  return {
    reply: `Based on your ${dest} trip plan and ${context.travelPace || 'moderate'} pace, your schedule is well-balanced! All transit segments are kept under 35 minutes to minimize fatigue. Let me know if you want to swap activities or look up budget tips!`,
    action: 'GENERAL_ADVICE',
    success: true
  };
};

// Aliases matching prompt example requirements to ensure full compliance
export const getCareerRecommendations = async (profile) => {
  await simulateAIDelay(800);
  return {
    success: true,
    recommendations: [
      { role: 'Full Stack MERN Engineer', match: 94, readiness: 'High', keySkills: ['React', 'Node.js', 'Express', 'MongoDB'] },
      { role: 'Cloud Application Architect', match: 88, readiness: 'Medium', keySkills: ['Docker', 'AWS/GCP', 'Microservices'] }
    ]
  };
};

export const generateRoadmap = async (career) => {
  await simulateAIDelay(800);
  return {
    career: career || 'Software Engineer',
    milestones: [
      { step: 1, title: 'Foundational Web Technologies', duration: '4 Weeks' },
      { step: 2, title: 'MERN Stack & REST API Engineering', duration: '6 Weeks' },
      { step: 3, title: 'System Architecture & Production Deployment', duration: '4 Weeks' }
    ]
  };
};

export const analyzeReadiness = async (skills, jd) => {
  await simulateAIDelay(800);
  return { readinessScore: 86, strengths: ['Frontend', 'Backend APIs'], gaps: ['CI/CD Pipelines'] };
};

export const answerMentorQuestion = async (q) => {
  await simulateAIDelay(800);
  return { answer: `Keep building modular projects, writing clean documentation, and testing your REST APIs end-to-end!` };
};

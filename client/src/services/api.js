import axios from 'axios';
import { generateAITripItinerary, askAITravelAssistant } from './aiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create configured Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 6000
});

// Request interceptor to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pathpilot_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful offline / demo fallback if backend server is inactive
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If network error (backend server not started or disconnected)
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.warn('[API Client] Backend unreachable. Activating local demo fallback store.');
      return handleOfflineFallback(error.config);
    }
    return Promise.reject(error);
  }
);

// Offline fallback store handling so that the demo NEVER fails under any conditions
const handleOfflineFallback = async (config) => {
  const url = config.url || '';
  const method = (config.method || 'get').toLowerCase();

  // Local saved trips in localStorage
  const getLocalTrips = () => {
    try {
      const stored = localStorage.getItem('pathpilot_saved_trips');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  };

  const saveLocalTrips = (trips) => {
    localStorage.setItem('pathpilot_saved_trips', JSON.stringify(trips));
  };

  // POST /api/auth/login or /api/auth/register
  if (url.includes('/auth/login') || url.includes('/auth/register')) {
    const mockUser = {
      id: 'demo_user_123',
      name: 'Demo Traveler',
      email: 'traveler@pathpilot.ai',
      role: 'traveler'
    };
    const mockToken = 'mock_jwt_token_demo_mode_xyz';
    localStorage.setItem('pathpilot_token', mockToken);
    localStorage.setItem('pathpilot_user', JSON.stringify(mockUser));
    return {
      data: {
        success: true,
        message: 'Authenticated in resilient demo mode',
        data: { token: mockToken, user: mockUser }
      }
    };
  }

  // GET /api/auth/me
  if (url.includes('/auth/me')) {
    const storedUser = localStorage.getItem('pathpilot_user');
    const user = storedUser ? JSON.parse(storedUser) : { id: 'demo_user_123', name: 'Demo Traveler', email: 'traveler@pathpilot.ai' };
    return { data: { success: true, data: user } };
  }

  // POST /api/trips/generate
  if (url.includes('/trips/generate')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const result = await generateAITripItinerary(body);
    return {
      data: {
        success: true,
        message: 'AI Itinerary generated via local AI engine',
        data: result
      }
    };
  }

  // POST /api/trips (save trip)
  if (url === '/trips' && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const currentTrips = getLocalTrips();
    const newTrip = {
      _id: 'trip_' + Date.now(),
      ...body,
      status: body.status || 'Planned',
      createdAt: new Date().toISOString()
    };
    currentTrips.unshift(newTrip);
    saveLocalTrips(currentTrips);
    return {
      data: {
        success: true,
        message: 'Trip saved to local storage',
        data: newTrip
      }
    };
  }

  // GET /api/trips
  if (url === '/trips' && method === 'get') {
    let currentTrips = getLocalTrips();
    if (currentTrips.length === 0) {
      // Seed default sample trip
      const sample = await generateAITripItinerary({ destination: 'Goa', days: 3, budget: 18000, travelers: 2 });
      const sampleTrip = {
        _id: 'trip_sample_goa',
        ...sample,
        createdAt: new Date().toISOString()
      };
      currentTrips = [sampleTrip];
      saveLocalTrips(currentTrips);
    }
    return {
      data: {
        success: true,
        count: currentTrips.length,
        data: currentTrips
      }
    };
  }

  // GET /api/trips/:id
  if (url.startsWith('/trips/') && method === 'get' && !url.includes('budget')) {
    const id = url.split('/trips/')[1].split('/')[0];
    const currentTrips = getLocalTrips();
    const found = currentTrips.find(t => t._id === id) || currentTrips[0];
    return { data: { success: true, data: found } };
  }

  // POST /api/chat
  if (url.includes('/chat')) {
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    const res = await askAITravelAssistant(body.message, body);
    return {
      data: {
        success: true,
        data: {
          reply: res.reply,
          action: res.action,
          timestamp: new Date().toISOString()
        }
      }
    };
  }

  // POST /api/feedback
  if (url.includes('/feedback')) {
    return {
      data: {
        success: true,
        message: 'Feedback registered successfully'
      }
    };
  }

  // Default empty success to avoid unhandled rejections
  return {
    data: {
      success: true,
      message: 'Processed in demo mode',
      data: null
    }
  };
};

export default api;

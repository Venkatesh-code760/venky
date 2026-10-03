const express = require('express');
const router = express.Router();
const {
  createTrip,
  generateItinerary,
  getTrips,
  getTripById,
  updateTrip,
  optimizeTrip,
  getTripBudget,
  deleteTrip
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Generation can be accessed publicly for instant preview, or authenticated
router.post('/generate', generateItinerary);

// Authenticated Trip endpoints
router.route('/')
  .post(protect, createTrip)
  .get(protect, getTrips);

router.route('/:id')
  .get(protect, getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

router.post('/:id/optimize', protect, optimizeTrip);
router.get('/:id/budget', protect, getTripBudget);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/placeController');

router.get('/', getRecommendations);

module.exports = router;

const express = require('express');
const router = express.Router();
const { handleChatMessage } = require('../controllers/chatController');

// Chat endpoint supports both guest and authenticated users
router.post('/', handleChatMessage);

module.exports = router;

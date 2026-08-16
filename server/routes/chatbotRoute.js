const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatbotController');

// Apply rate limiting to avoid spam
router.post('/', handleChat);
module.exports = router;
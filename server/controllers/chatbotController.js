// controllers/chatbotController.js
const { parseAndReply } = require('../utils/chatbotParser');
const { asyncHandler, throwError } = require('../utils/errorHandler');
exports.handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    throwError('Message is required', 400);
  }
  console.log('🤖 Chatbot API called');
  const reply = parseAndReply(message);
  res.json({ reply });
});
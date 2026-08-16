// routes/dashboardRoute.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler, throwError } = require('../utils/errorHandler');

const router = express.Router();

// ─── GET /api/dashboard/profile ───
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) throwError('User not found', 404);
  res.json({ id: user._id, name: user.name, email: user.email, createdAt: user.createdAt });
}));

module.exports = router;
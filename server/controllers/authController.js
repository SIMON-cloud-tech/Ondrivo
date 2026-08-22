// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler, throwError } = require('../utils/errorHandler');

// ── JWT Secret check ──
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

// ── Cookie options ──
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── Helper: Generate JWT ──
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
};

// ── Helper: Set auth cookie ──
const setAuthCookie = (res, token) => {
  res.cookie('token', token, COOKIE_OPTIONS);
};

// ── Helper: Clear auth cookie ──
const clearAuthCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};

// ── Helper: Send user response ──
const sendUserResponse = (res, user, status = 200) => {
  res.status(status).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// ─── REGISTER ───
exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  
  //check if there is any users registred 
  const userCount = await User.countDocuments();

  //restrict registration if user mode has a user already
  if (userCount > 0) {
    throwError('Registration is disabled. Only the admin account is allowed.', 403);
  }

  // ── Validate ──
  if (!fullName || !email || !password) {
    throwError('All fields are required');
  }
  if (password.length < 8) {
    throwError('Password must be at least 8 characters');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // ── Check existing user ──
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throwError('Email already registered');
  }

  // ── Hash password & create user ──
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name: fullName,
    email: normalizedEmail,
    password: hashedPassword,
  });
  await newUser.save();

  // ── Set cookie & respond ──
  const token = generateToken(newUser);
  setAuthCookie(res, token);
  sendUserResponse(res, newUser, 201);
});

// ─── LOGIN ───
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throwError('Email and password required');
  }

  // ── Find user ──
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throwError('Invalid credentials', 401);
  }

  // ── Check password ──
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throwError('Invalid credentials', 401);
  }

  // ── Set cookie & respond ──
  const token = generateToken(user);
  setAuthCookie(res, token);
  sendUserResponse(res, user);
});

// ─── GET PROFILE ───
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throwError('User not found', 404);
  }
  sendUserResponse(res, user);
});

// ─── LOGOUT ───
exports.logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out successfully' });
});
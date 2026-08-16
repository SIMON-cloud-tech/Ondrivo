// controllers/resetController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpStore = require('../models/otpStore');
const { sendOTPEmail } = require('../utils/sendEmail');
const { asyncHandler, throwError } = require('../utils/errorHandler');

// ── Constants ──
const MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 10 * 60 * 1000;

// ── Helper: Generate OTP ──
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Helper: Normalize email ──
const normalizeEmail = (email) => email.toLowerCase().trim();

// ── Helper: Check OTP record ──
const validateOtpRecord = (record) => {
  if (!record) throwError('Invalid or expired code', 400);
  if (Date.now() > record.expiresAt) {
    OtpStore.deleteOne({ email: record.email });
    throwError('Invalid or expired code', 400);
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    OtpStore.deleteOne({ email: record.email });
    throwError('Too many attempts. Please request a new code.', 429);
  }
};

// ── Helper: Delete OTP ──
const deleteOtp = async (email) => {
  await OtpStore.deleteOne({ email });
};

// ─── 1. SEND OTP ───
exports.sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throwError('Email is required', 400);

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  // Always return same message whether or not account exists
  if (!user) {
    return res.json({ message: 'If that email is registered, a code has been sent.' });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  await OtpStore.findOneAndUpdate(
    { email: normalizedEmail },
    { otp, expiresAt, attempts: 0 },
    { upsert: true, new: true }
  );

  await sendOTPEmail(normalizedEmail, otp, 'password reset');

  // Never echo OTP in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📧 OTP for ${normalizedEmail}: ${otp}`);
  }

  res.json({ message: 'If that email is registered, a code has been sent.' });
});

// ─── 2. VERIFY OTP ───
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throwError('Email and OTP required', 400);

  const normalizedEmail = normalizeEmail(email);
  const record = await OtpStore.findOne({ email: normalizedEmail });

  validateOtpRecord(record);

  if (record.otp !== otp) {
    record.attempts += 1;
    await record.save();
    throwError('Invalid or expired code', 400);
  }

  res.json({ message: 'Code verified successfully' });
});

// ─── 3. RESET PASSWORD ───
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throwError('Email, code, and new password required', 400);
  }
  if (newPassword.length < 8) {
    throwError('Password must be at least 8 characters', 400);
  }

  const normalizedEmail = normalizeEmail(email);
  const record = await OtpStore.findOne({ email: normalizedEmail });

  validateOtpRecord(record);

  if (record.otp !== otp) {
    record.attempts += 1;
    await record.save();
    throwError('Invalid or expired code', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate({ email: normalizedEmail }, { password: hashedPassword });

  await deleteOtp(normalizedEmail);

  res.json({ message: 'Password reset successful' });
});
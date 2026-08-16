// models/OtpStore.js
const mongoose = require('mongoose');

const otpStoreSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  attempts: { type: Number, default: 0 } // tracks failed verify attempts, for lockout
});

module.exports = mongoose.model('OtpStore', otpStoreSchema);
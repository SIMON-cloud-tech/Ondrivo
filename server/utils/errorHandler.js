// utils/errorHandler.js

// ── 1. Async Handler ──
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ── 2. Global Error Handler ──
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message || err);

  const status = err.status || 500;
  const message = err.message || 'Server error';

  res.status(status).json({ message });
};

// ── 3. Helper: Throw error with status ──
const throwError = (message, status = 400) => {
  const err = new Error(message);
  err.status = status;
  throw err;
};

module.exports = { asyncHandler, errorHandler, throwError };
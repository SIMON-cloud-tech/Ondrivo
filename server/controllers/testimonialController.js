// controllers/testimonialController.js
const Testimonial = require('../models/Testimonials');
const crypto = require('crypto');
const { asyncHandler, throwError } = require('../utils/errorHandler');

// ─── PUBLIC ───
exports.getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.json(testimonials);
});

// ─── PROTECTED ───
exports.addTestimonial = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { name, location, text } = req.body;

  if (!name || !text) {
    throwError('Name and testimonial text are required');
  }

  const newTestimonial = new Testimonial({
    id: crypto.randomUUID(),
    userId,
    name,
    location: location || '',
    text,
  });

  await newTestimonial.save();
  res.status(201).json(newTestimonial);
});

exports.updateTestimonial = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  const { name, location, text } = req.body;

  const testimonial = await Testimonial.findOne({ id, userId });
  if (!testimonial) {
    throwError('Testimonial not found or unauthorized', 404);
  }

  if (name) testimonial.name = name;
  if (location !== undefined) testimonial.location = location;
  if (text) testimonial.text = text;

  await testimonial.save();
  res.json(testimonial);
});

exports.deleteTestimonial = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  const result = await Testimonial.deleteOne({ id, userId });
  if (result.deletedCount === 0) {
    throwError('Testimonial not found or unauthorized', 404);
  }

  res.json({ message: 'Testimonial deleted successfully' });
});
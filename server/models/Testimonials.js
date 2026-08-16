// models/Testimonial.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // who added it
  name: { type: String, required: true, trim: true, maxlength: 100 },
  location: { type: String, default: '', trim: true, maxlength: 100 },
  text: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
// models/CaseStudy.js
const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true, trim: true },
  client: { type: String, required: true, trim: true },
  industry: { type: String, required: true, trim: true },
  problem: { type: String, required: true },
  approach: { type: String, required: true },
  solution: { type: String, required: true },
  coverImage: { type: String, default: '' },
  technologies: { type: [String], default: [] },
  slug: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// ── No pre-save hook ──

module.exports = mongoose.model('CaseStudy', caseStudySchema);
// models/Projects.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true, trim: true },
  client: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  longDescription: { type: String, default: '' },
  projectUrl: { type: String, default: '' },
   slug: { type: String, unique: true, sparse: true },
  image: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
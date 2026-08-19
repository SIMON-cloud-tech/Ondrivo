// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // your own string id (crypto.randomUUID(), not Date.now())
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // matches JWT's real _id now
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 50000 },
  keywords: { type: String, default: '', trim: true, maxlength: 300 },
  slug: { type: String, unique: true, sparse: true },
  image: { type: String, default: '' }
}, { timestamps: true }); // auto createdAt/updatedAt — controller no longer needs to set them manually

module.exports = mongoose.model('Blog', blogSchema);
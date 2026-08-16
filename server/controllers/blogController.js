// controllers/blogController.js
const crypto = require('crypto');
const Blog = require('../models/Blogs');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { asyncHandler, throwError } = require('../utils/errorHandler');

// ── Helper: Upload image ──
const uploadImage = async (file, folder = 'ondrivo/blogs') => {
  if (!file) return '';
  return await uploadToCloudinary(file.buffer, folder);
};

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};



// ─── PUBLIC: get all blogs ───
exports.getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// ─── PUBLIC: get a single blog by ID ───
exports.getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findOne({ id });
  if (!blog) {
    throwError('Blog not found', 404);
  }
  res.json(blog);
});

// ─── PUBLIC: get a single blog by slug ───
exports.getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug });
  if (!blog) {
    throwError('Blog not found', 404);
  }
  res.json(blog);
});

// ─── PROTECTED: add a new blog ───
exports.addBlog = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { title, description, keywords } = req.body;

  if (!title || !description) {
    throwError('Title and description are required');
  }

  const imageUrl = await uploadImage(req.file);

  const newBlog = new Blog({
    id: crypto.randomUUID(),
    userId,
    title,
    description,
    keywords: keywords || '',
    slug: generateSlug(title),
    image: imageUrl,
  });

  await newBlog.save();
  res.status(201).json(newBlog);
});

// ─── PROTECTED: update a blog ───
exports.updateBlog = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id: blogId } = req.params;
  const { title, description, keywords } = req.body;

  const blog = await Blog.findOne({ id: blogId, userId });
  if (!blog) {
    throwError('Blog not found or unauthorized', 404);
  }

  if (title) blog.title = title;
  if (description) blog.description = description;
  if (keywords !== undefined) blog.keywords = keywords;

  if (req.file) {
    blog.image = await uploadImage(req.file);
  }

  await blog.save();
  res.json(blog);
});

// ─── PROTECTED: delete a blog ───
exports.deleteBlog = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id: blogId } = req.params;

  const result = await Blog.deleteOne({ id: blogId, userId });
  if (result.deletedCount === 0) {
    throwError('Blog not found or unauthorized', 404);
  }

  res.json({ message: 'Blog deleted successfully' });
});
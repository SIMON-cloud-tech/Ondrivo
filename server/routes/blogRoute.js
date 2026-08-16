const express = require('express');
const { getBlogs, getBlogById, addBlog, updateBlog, deleteBlog, getBlogBySlug } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public routes (no auth)
router.get('/slug/:slug', getBlogBySlug);
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Protected routes (admin only)
router.post('/', authMiddleware, upload.single('image'), addBlog);
router.put('/:id', authMiddleware, upload.single('image'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
// routes/caseStudyRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getCaseStudies,
  getCaseStudyById,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
} = require('../controllers/caseStudyController');
// ── Public routes (no auth) ──
router.get('/', getCaseStudies);
router.get('/slug/:slug', getCaseStudyBySlug);
router.get('/:id', getCaseStudyById);

// ── Protected routes (admin only) ──
router.post('/', authMiddleware, upload.single('coverImage'), createCaseStudy);
router.put('/:id', authMiddleware, upload.single('coverImage'), updateCaseStudy);
router.delete('/:id', authMiddleware, deleteCaseStudy);

module.exports = router;
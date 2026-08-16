// controllers/CaseStudyController.js
const crypto = require('crypto');
const CaseStudy = require('../models/CaseStudy');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { asyncHandler, throwError } = require('../utils/errorHandler');

// ── Helper: Upload image ──
const uploadImage = async (file) => {
  if (!file) return '';
  return await uploadToCloudinary(file.buffer, 'ondrivo/case-studies');
};

// ── Helper: Generate slug ──
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

// ── Helper: Parse technologies ──
const parseTechnologies = (techString) => {
  if (!techString) return [];
  return techString.split(',').map(t => t.trim()).filter(Boolean);
};

// ─── PUBLIC: get all case studies ───
exports.getCaseStudies = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  let query = CaseStudy.find().sort({ createdAt: -1 });
  if (limit) query = query.limit(parseInt(limit));
  res.json(await query);
});

// ─── PUBLIC: get by ID ───
exports.getCaseStudyById = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findOne({ id: req.params.id });
  if (!caseStudy) throwError('Case study not found', 404);
  res.json(caseStudy);
});

// ─── PUBLIC: get by slug ───
exports.getCaseStudyBySlug = asyncHandler(async (req, res) => {
  const caseStudy = await CaseStudy.findOne({ slug: req.params.slug });
  if (!caseStudy) throwError('Case study not found', 404);
  res.json(caseStudy);
});

// ─── PROTECTED: create ───
exports.createCaseStudy = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { title, client, industry, problem, approach, solution, technologies } = req.body;

  if (!title || !client || !industry || !problem || !approach || !solution) {
    throwError('Title, client, industry, problem, approach, and solution are required');
  }

  const newCaseStudy = new CaseStudy({
    id: crypto.randomUUID(),
    userId,
    title,
    client,
    industry,
    problem,
    approach,
    solution,
    slug: generateSlug(title),  // ✅ Fixed
    coverImage: await uploadImage(req.file),
    technologies: parseTechnologies(technologies),
  });

  await newCaseStudy.save();
  res.status(201).json(newCaseStudy);
});

// ─── PROTECTED: update ───
exports.updateCaseStudy = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id: caseStudyId } = req.params;
  const { title, client, industry, problem, approach, solution, technologies } = req.body;

  const caseStudy = await CaseStudy.findOne({ id: caseStudyId, userId });
  if (!caseStudy) throwError('Case study not found or unauthorized', 404);

  if (title) {
    caseStudy.title = title;
    caseStudy.slug = generateSlug(title);  // ✅ Update slug when title changes
  }
  if (client) caseStudy.client = client;
  if (industry) caseStudy.industry = industry;
  if (problem) caseStudy.problem = problem;
  if (approach) caseStudy.approach = approach;
  if (solution) caseStudy.solution = solution;
  if (technologies !== undefined) {
    caseStudy.technologies = parseTechnologies(technologies);
  }
  if (req.file) {
    caseStudy.coverImage = await uploadImage(req.file);
  }

  await caseStudy.save();
  res.json(caseStudy);
});

// ─── PROTECTED: delete ───
exports.deleteCaseStudy = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id: caseStudyId } = req.params;

  const result = await CaseStudy.deleteOne({ id: caseStudyId, userId });
  if (result.deletedCount === 0) {
    throwError('Case study not found or unauthorized', 404);
  }

  res.json({ message: 'Case study deleted successfully' });
});
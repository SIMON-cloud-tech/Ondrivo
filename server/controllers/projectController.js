// controllers/projectController.js
const crypto = require('crypto');
const Project = require('../models/Projects');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { asyncHandler, throwError } = require('../utils/errorHandler');

// ── Helper: Upload image ──
const uploadImage = async (file) => {
  if (!file) return '';
  return await uploadToCloudinary(file.buffer, 'ondrivo/projects');
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

// ─── PUBLIC: get all projects ───
exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

// ─── PUBLIC: get by ID ───
exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ id: req.params.id });
  if (!project) throwError('Project not found', 404);
  res.json(project);
});

// ─── PUBLIC: get by slug ───
exports.getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) throwError('Project not found', 404);
  res.json(project);
});

// ─── PROTECTED: create ───
exports.addProject = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { title, client, shortDescription, longDescription, projectUrl } = req.body;

  if (!title || !client || !shortDescription) {
    throwError('Title, client, and short description are required');
  }

  const newProject = new Project({
    id: crypto.randomUUID(),
    userId,
    title,
    client,
    shortDescription,
    longDescription: longDescription || '',
    projectUrl: projectUrl || '',
    slug: generateSlug(title),
    image: await uploadImage(req.file),
  });

  await newProject.save();
  res.status(201).json(newProject);
});

// ─── PROTECTED: update ───
exports.updateProject = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  const { title, client, shortDescription, longDescription, projectUrl } = req.body;

  const project = await Project.findOne({ id, userId });
  if (!project) throwError('Project not found or unauthorized', 404);

  if (title) {
    project.title = title;
    project.slug = generateSlug(title);
  }
  if (client) project.client = client;
  if (shortDescription) project.shortDescription = shortDescription;
  if (longDescription !== undefined) project.longDescription = longDescription;
  if (projectUrl !== undefined) project.projectUrl = projectUrl;
  if (req.file) project.image = await uploadImage(req.file);

  await project.save();
  res.json(project);
});

// ─── PROTECTED: delete ───
exports.deleteProject = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;

  const result = await Project.deleteOne({ id, userId });
  if (result.deletedCount === 0) {
    throwError('Project not found or unauthorized', 404);
  }

  res.json({ message: 'Project deleted successfully' });
});
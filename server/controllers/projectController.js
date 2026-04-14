const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

const getProjects = async (req, res, next) => {
  try {
    const filter = { isPublished: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.mediaType) filter.mediaType = req.query.mediaType;
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
};

const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (err) { next(err); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { next(err); }
};

const uploadProjectMedia = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({
      success: true,
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        mediaType: req.file.mimetype.startsWith('video') ? 'video' : 'image',
      },
    });
  } catch (err) { next(err); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { next(err); }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    const resourceType = project.mediaType === 'video' ? 'video' : 'image';
    if (project.mediaPublicId) {
      await cloudinary.uploader.destroy(project.mediaPublicId, { resource_type: resourceType }).catch(() => {});
    }
    if (project.thumbnailPublicId) {
      await cloudinary.uploader.destroy(project.thumbnailPublicId).catch(() => {});
    }
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { next(err); }
};

module.exports = { getProjects, getAllProjectsAdmin, getProject, createProject, uploadProjectMedia, updateProject, deleteProject };

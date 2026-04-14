const express = require('express');
const router = express.Router();
const {
  getProjects, getAllProjectsAdmin, getProject,
  createProject, uploadProjectMedia, updateProject, deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAny } = require('../config/cloudinary');

router.get('/', getProjects);
router.get('/admin/all', protect, getAllProjectsAdmin);
router.get('/:id', getProject);
router.post('/', protect, createProject);
router.post('/upload-media', protect, uploadAny.single('media'), uploadProjectMedia);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;

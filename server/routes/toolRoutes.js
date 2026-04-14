const express = require('express');
const router = express.Router();
const { getTools, createTool, uploadToolIcon, updateTool, deleteTool } = require('../controllers/toolController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../config/cloudinary');

router.get('/', getTools);
router.post('/', protect, createTool);
router.post('/upload-icon', protect, uploadImage.single('icon'), uploadToolIcon);
router.put('/:id', protect, updateTool);
router.delete('/:id', protect, deleteTool);

module.exports = router;

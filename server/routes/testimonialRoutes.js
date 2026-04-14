const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, uploadAvatar, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../config/cloudinary');

router.get('/', getTestimonials);
router.post('/', protect, createTestimonial);
router.post('/upload-avatar', protect, uploadImage.single('avatar'), uploadAvatar);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAbout, updateAbout, uploadPhoto } = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImage } = require('../config/cloudinary');

router.get('/', getAbout);
router.put('/', protect, updateAbout);
router.post('/upload-photo', protect, uploadImage.single('photo'), uploadPhoto);

module.exports = router;

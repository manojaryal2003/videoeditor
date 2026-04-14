const express = require('express');
const router = express.Router();
const { getHero, updateHero, uploadHeroVideo } = require('../controllers/heroController');
const { protect } = require('../middleware/authMiddleware');
const { uploadVideo } = require('../config/cloudinary');

router.get('/', getHero);
router.put('/', protect, updateHero);
router.post('/upload-video', protect, uploadVideo.single('video'), uploadHeroVideo);

module.exports = router;

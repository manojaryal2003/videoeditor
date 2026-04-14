const express = require('express');
const router = express.Router();
const { getStats, createStat, updateStat, deleteStat } = require('../controllers/statController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getStats);
router.post('/', protect, createStat);
router.put('/:id', protect, updateStat);
router.delete('/:id', protect, deleteStat);

module.exports = router;

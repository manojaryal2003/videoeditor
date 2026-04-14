const express = require('express');
const router = express.Router();
const { submitContact, getContacts, markRead, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const validateContact = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
];

router.post('/', validateContact, submitContact);
router.get('/', protect, getContacts);
router.put('/:id/read', protect, markRead);
router.delete('/:id', protect, deleteContact);

module.exports = router;

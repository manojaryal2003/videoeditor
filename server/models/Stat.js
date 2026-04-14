const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
  suffix: { type: String, default: '+' },
  icon: { type: String, default: 'FiStar' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Stat', StatSchema);

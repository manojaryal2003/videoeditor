const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  tier: { type: String, enum: ['Basic', 'Standard', 'Premium'], required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, default: '' },
  deliveryTime: { type: String, default: '' },
  features: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);

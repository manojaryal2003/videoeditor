const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconUrl: { type: String, default: '' },
  iconPublicId: { type: String, default: '' },
  category: { type: String, default: 'Editing' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Tool', ToolSchema);

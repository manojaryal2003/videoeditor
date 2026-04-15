const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Videos', 'Shorts', 'Thumbnails', 'Banners'], required: true },
  tags: [{ type: String }],
  mediaUrl: { type: String, required: true },
  mediaPublicId: { type: String, default: '' },
  mediaType: { type: String, enum: ['video', 'image'], required: true },
  thumbnailUrl: { type: String, default: '' },
  thumbnailPublicId: { type: String, default: '' },
  clientName: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  externalLink: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

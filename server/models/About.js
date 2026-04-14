const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  yearsExperience: { type: Number, default: 0 },
  location: { type: String, default: '' },
  tagline: { type: String, default: '' },
  skills: [{ type: String }],
  whatsappNumber: { type: String, default: '' },
  socialLinks: {
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);

const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  greeting: { type: String, default: "Hello, I'm" },
  name: { type: String, required: true, default: 'Your Name' },
  typingWords: [{ type: String }],
  subheading: { type: String, default: 'Professional Video Editor & Motion Designer' },
  ctaLabel: { type: String, default: 'View My Work' },
  ctaLink: { type: String, default: '#portfolio' },
  hireMeLabel: { type: String, default: 'Hire Me' },
  videoUrl: { type: String, default: '' },
  videoPublicId: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Hero', HeroSchema);

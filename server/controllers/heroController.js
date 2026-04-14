const Hero = require('../models/Hero');
const { cloudinary } = require('../config/cloudinary');

const getHero = async (req, res, next) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) hero = await Hero.create({ name: 'Your Name', typingWords: ['Video Editor', 'Motion Designer', 'Colorist'] });
    res.json({ success: true, data: hero });
  } catch (err) { next(err); }
};

const updateHero = async (req, res, next) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, { upsert: true, new: true, runValidators: true });
    res.json({ success: true, data: hero });
  } catch (err) { next(err); }
};

const uploadHeroVideo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const hero = await Hero.findOne();
    if (hero?.videoPublicId) {
      await cloudinary.uploader.destroy(hero.videoPublicId, { resource_type: 'video' }).catch(() => {});
    }
    const updated = await Hero.findOneAndUpdate(
      {},
      { videoUrl: req.file.path, videoPublicId: req.file.filename },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

module.exports = { getHero, updateHero, uploadHeroVideo };

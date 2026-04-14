const About = require('../models/About');
const { cloudinary } = require('../config/cloudinary');

const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) about = await About.create({});
    res.json({ success: true, data: about });
  } catch (err) { next(err); }
};

const updateAbout = async (req, res, next) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true, runValidators: true });
    res.json({ success: true, data: about });
  } catch (err) { next(err); }
};

const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const about = await About.findOne();
    if (about?.photoPublicId) {
      await cloudinary.uploader.destroy(about.photoPublicId).catch(() => {});
    }
    const updated = await About.findOneAndUpdate(
      {},
      { photoUrl: req.file.path, photoPublicId: req.file.filename },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
};

module.exports = { getAbout, updateAbout, uploadPhoto };

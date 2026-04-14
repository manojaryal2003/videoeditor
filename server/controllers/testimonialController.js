const Testimonial = require('../models/Testimonial');
const { cloudinary } = require('../config/cloudinary');

const getTestimonials = async (req, res, next) => {
  try {
    const filter = req.admin ? {} : { isPublished: true };
    const testimonials = await Testimonial.find(filter).sort('order');
    res.json({ success: true, data: testimonials });
  } catch (err) { next(err); }
};

const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (err) { next(err); }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename } });
  } catch (err) { next(err); }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: t });
  } catch (err) { next(err); }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    if (t.avatarPublicId) await cloudinary.uploader.destroy(t.avatarPublicId).catch(() => {});
    await t.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTestimonials, createTestimonial, uploadAvatar, updateTestimonial, deleteTestimonial };

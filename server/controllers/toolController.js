const Tool = require('../models/Tool');
const { cloudinary } = require('../config/cloudinary');

const getTools = async (req, res, next) => {
  try {
    const tools = await Tool.find().sort('order');
    res.json({ success: true, data: tools });
  } catch (err) { next(err); }
};

const createTool = async (req, res, next) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json({ success: true, data: tool });
  } catch (err) { next(err); }
};

const uploadToolIcon = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename } });
  } catch (err) { next(err); }
};

const updateTool = async (req, res, next) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tool) return res.status(404).json({ success: false, message: 'Tool not found' });
    res.json({ success: true, data: tool });
  } catch (err) { next(err); }
};

const deleteTool = async (req, res, next) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ success: false, message: 'Tool not found' });
    if (tool.iconPublicId) await cloudinary.uploader.destroy(tool.iconPublicId).catch(() => {});
    await tool.deleteOne();
    res.json({ success: true, message: 'Tool deleted' });
  } catch (err) { next(err); }
};

module.exports = { getTools, createTool, uploadToolIcon, updateTool, deleteTool };

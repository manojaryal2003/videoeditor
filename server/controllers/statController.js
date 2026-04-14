const Stat = require('../models/Stat');

const getStats = async (req, res, next) => {
  try {
    const stats = await Stat.find().sort('order');
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

const createStat = async (req, res, next) => {
  try {
    const stat = await Stat.create(req.body);
    res.status(201).json({ success: true, data: stat });
  } catch (err) { next(err); }
};

const updateStat = async (req, res, next) => {
  try {
    const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stat) return res.status(404).json({ success: false, message: 'Stat not found' });
    res.json({ success: true, data: stat });
  } catch (err) { next(err); }
};

const deleteStat = async (req, res, next) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);
    if (!stat) return res.status(404).json({ success: false, message: 'Stat not found' });
    res.json({ success: true, message: 'Stat deleted' });
  } catch (err) { next(err); }
};

module.exports = { getStats, createStat, updateStat, deleteStat };

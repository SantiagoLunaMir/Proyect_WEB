// back/routes/works.js
const { Router } = require('express');
const Work       = require('../models/Work');
const { verifyToken, requireRole } = require('../middleware/auth');
const router     = Router();

// GET /api/works  (solo technician/admin)
router.get(
  '/',
  verifyToken,
  requireRole(['technician','admin']),
  async (req, res) => {
    try {
      const works = await Work.find({ technicianId: req.user.id })
                              .populate('pieceId doctorId');
      res.json(works);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/works
router.post(
  '/',
  verifyToken,
  requireRole(['technician','admin']),  
  async (req, res) => {
    try {
      const work = new Work({ ...req.body, technicianId: req.user.id });
      const saved = await work.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT /api/works/:id
router.put(
  '/:id',
  verifyToken,
  requireRole(['technician','admin']),
  async (req, res) => {
    try {
      const updated = await Work.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Work not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE /api/works/:id  (solo admin)
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const deleted = await Work.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Work not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

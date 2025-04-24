// back/routes/doctors.js
const { Router }            = require('express');
const Doctor                = require('../models/Doctor');
const { verifyToken, requireRole } = require('../middleware/auth');
const router                = Router();

// GET /api/doctors  (authenticated roles: admin, technician, delivery)
router.get(
  '/',
  verifyToken,
  requireRole(['admin','technician','delivery']),
  async (req, res) => {
    try {
      const docs = await Doctor.find();
      res.json(docs);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/doctors  (admin only)
router.post(
  '/',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const newDoc = new Doctor(req.body);
      const saved  = await newDoc.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT /api/doctors/:id  (admin only)
router.put(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const updated = await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Doctor no encontrado' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE /api/doctors/:id  (admin only)
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const deleted = await Doctor.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Doctor no encontrado' });
      res.json({ message: 'Doctor eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

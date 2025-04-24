// back/routes/pieces.js
const { Router } = require('express');
const Piece = require('../models/Piece');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = Router();

// GET /api/pieces — público
router.get('/', async (req, res) => {
  try {
    const pieces = await Piece.find();
    res.json(pieces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pieces — admin o technician
router.post(
  '/',
  verifyToken,
  requireRole(['admin','technician']),
  async (req, res) => {
    try {
      const newPiece = new Piece(req.body);
      const saved = await newPiece.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// PUT /api/pieces/:id — admin o technician
router.put(
  '/:id',
  verifyToken,
  requireRole(['admin','technician']),
  async (req, res) => {
    try {
      const updated = await Piece.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'No encontrada' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE /api/pieces/:id — solo admin
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const deleted = await Piece.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'No encontrada' });
      res.json({ message: 'Eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

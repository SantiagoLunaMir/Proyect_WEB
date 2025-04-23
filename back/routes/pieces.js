const { Router } = require('express');
const Piece = require('../models/Piece');
const router = Router();

// GET /api/pieces
router.get('/', async (req, res) => {
  try {
    const pieces = await Piece.find();
    res.json(pieces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

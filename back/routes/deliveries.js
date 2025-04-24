// back/routes/deliveries.js
const { Router } = require('express');
const Delivery   = require('../models/Delivery');
const { verifyToken, requireRole } = require('../middleware/auth');
const router     = Router();

// GET /api/deliveries — driver/admin
router.get(
  '/',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    try {
      const filter = req.user.role === 'delivery'
        ? { driverId: req.user.id }
        : {};
      const list = await Delivery.find(filter)
        .populate('workId', 'productionTime deliveryDate cost status')
        .populate('driverId', 'name email');
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PATCH /api/deliveries/:id — driver marks delivered & amount
router.patch(
  '/:id',
  verifyToken,
  requireRole(['delivery']),
  async (req, res) => {
    try {
      const { status, amountCollected } = req.body;
      const updated = await Delivery.findByIdAndUpdate(
        req.params.id,
        { status, amountCollected },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Delivery not found' });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;

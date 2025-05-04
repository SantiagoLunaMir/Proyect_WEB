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
        // Populamos workId y dentro de éste al doctor
        .populate({
          path: 'workId',
          select: 'productionTime deliveryDate cost status doctorId',
          populate: {
            path: 'doctorId',
            select: 'name address contactInfo'
          }
        })
        .populate('driverId', 'name email');
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

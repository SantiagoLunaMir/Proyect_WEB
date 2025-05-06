// back/routes/deliveries.js
const { Router } = require('express');
const Delivery    = require('../models/Delivery');
const Work        = require('../models/Work');
const verifyToken = require('../middleware/verifyToken');
const requireRole = require('../middleware/requireRole');

const router = Router();

/* ---------- ASIGNAR trabajos al repartidor ---------- */
router.post(
  '/assign',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const { workIds } = req.body;
    if (!Array.isArray(workIds) || !workIds.length)
      return res.status(400).json({ error: 'workIds requerido' });

    const ya = await Delivery.find({
      workId: { $in: workIds },
      status: 'pending'
    }).distinct('workId');

    const libres = workIds.filter(id => !ya.includes(id));
    if (!libres.length) return res.status(400).json({ error: 'Ya asignados' });

    const deliveries = await Promise.all(
      libres.map(id => Delivery.create({ workId: id, driverId: req.user.id }))
    );

    // Opcional: actualizar estado en Work
    await Work.updateMany(
      { _id: { $in: libres } },
      { status: 'outForDelivery' }
    );

    res.status(201).json(deliveries);
  }
);

/* ---------- ENTREGAS PENDIENTES DEL CONDUCTOR ---------- */
router.get(
  '/my',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const list = await Delivery.find({
      driverId: req.user.id,
      status: 'pending'
    }).populate({
      path: 'workId',
      populate: [
        { path: 'pieceId', select: 'name' },
        { path: 'doctorId', select: 'name address' }
      ]
    });
    res.json(list);
  }
);

/* ---------- ENTREGAS DE HOY (alias de /my) ---------- */
router.get(
  '/today',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const list = await Delivery.find({
      driverId: req.user.id,
      status: 'pending'
    }).populate({
      path: 'workId',
      populate: [
        { path: 'pieceId', select: 'name' },
        { path: 'doctorId', select: 'name address' }
      ]
    });
    res.json(list);
  }
);

/* ---------- MARCAR ENTREGADO ---------- */
router.put(
  '/:id/delivered',
  verifyToken,
  requireRole(['delivery','admin']),
  async (req, res) => {
    const d = await Delivery.findById(req.params.id).populate('workId');
    if (
      !d ||
      (d.driverId.toString() !== req.user.id && req.user.role !== 'admin')
    ) {
      return res.status(404).json({ error: 'No encontrado' });
    }

    // Registrar monto si se envía
    if (req.body.amountCollected != null) {
      d.amountCollected = req.body.amountCollected;
    }
    d.status = 'delivered';
    await d.save();

    // Actualizar estado del Work relacionado
    d.workId.status = 'done';
    await d.workId.save();

    res.json({ message: 'Entregado', amountCollected: d.amountCollected });
  }
);

module.exports = router;

// back/routes/works.js
const { Router }            = require('express');
const { param, body }       = require('express-validator');
const Work                  = require('../models/Work');
const Delivery              = require('../models/Delivery');
const verifyToken           = require('../middleware/verifyToken');
const requireRole           = require('../middleware/requireRole');
const validate              = require('../middleware/validate');

const router = Router();

router.get(
  '/available',
  verifyToken,
  requireRole(['delivery','admin']),
  async (_req, res) => {
    const taken = await Delivery.find({ status:'pending' }).distinct('workId');
    const list  = await Work.find({ _id: { $nin: taken } })
      .populate('pieceId','name')
      .populate('doctorId','name address');
    res.json(list);
  }
);

router.get(
  '/',
  verifyToken,
  requireRole(['technician','admin']),
  async (req, res) => {
    const filter = req.user.role === 'technician'
      ? { technicianId: req.user.id }
      : {};
    const list = await Work.find(filter).populate('pieceId doctorId');
    res.json(list);
  }
);

router.post(
  '/',
  verifyToken,
  requireRole(['technician','admin']),
  async (req, res) => {
    const work = await Work.create({ ...req.body, technicianId: req.user.id });
    res.status(201).json(work);
  }
);

router.put(
  '/:id',
  verifyToken,
  requireRole(['technician','admin']),
  async (req, res) => {
    // Mapea algunos estados en inglés al enum inglés
    if (req.body.status === 'completed') {
      req.body.status = 'done';
    } else if (req.body.status === 'in-progress') {
      req.body.status = 'working';
    }

    const w = await Work.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!w) return res.status(404).json({ error: 'Work not found' });
    res.json(w);
  }
);

router.patch(
  '/:id/status',
  verifyToken,
  requireRole(['technician','admin']),
  [
    param('id').isMongoId(),
    body('status').isIn(['working', 'done'])
  ],
  validate,
  async (req, res) => {
    let work;
    if (req.user.role === 'admin') {
      work = await Work.findById(req.params.id);
    } else {
      work = await Work.findOne({
        _id: req.params.id,
        technicianId: req.user.id
      });
    }
    if (!work) return res.status(404).json({ error: 'Work not found' });

    work.status = req.body.status;
    await work.save();
    res.json({ message: 'Status updated', status: work.status });
  }
);

module.exports = router;

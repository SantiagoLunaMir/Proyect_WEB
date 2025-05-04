// back/routes/works.js
const { Router } = require('express');
const Work      = require('../models/Work');
const Delivery  = require('../models/Delivery');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = Router();

/* ========= NUEVO: trabajos disponibles para reparto ========= */
router.get('/available', verifyToken, requireRole(['delivery','admin']), async (_req,res)=>{
  // Ids de trabajos que YA tienen una entrega pendiente
  const taken = await Delivery.find({ status:'pending' }).distinct('workId');
  const list  = await Work.find({ _id: { $nin: taken } })
    .populate('pieceId','name')
    .populate('doctorId','name address')
    .populate('doctorId','name');
  res.json(list);
});

/* -------- LISTA PROPIA DE TÉCNICO / ADMIN -------- */
router.get('/', verifyToken, requireRole(['technician','admin']), async (req,res)=>{
  const filter = req.user.role === 'technician' ? { technicianId: req.user.id } : {};
  const list = await Work.find(filter).populate('pieceId doctorId');
  res.json(list);
});

/* -------- CREAR / EDITAR / BORRAR  (sin cambios) -------- */
router.post('/', verifyToken, requireRole(['technician','admin']), async (req,res)=>{
  const work = await Work.create({ ...req.body, technicianId: req.user.id });
  res.status(201).json(work);
});

router.put('/:id', verifyToken, requireRole(['technician','admin']), async (req,res)=>{
  const w = await Work.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators:true });
  if (!w) return res.status(404).json({ error:'Work not found' });
  res.json(w);
});

router.delete('/:id', verifyToken, requireRole(['admin']), async (req,res)=>{
  const deleted = await Work.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error:'Work not found' });
  res.json({ message:'Deleted' });
});

module.exports = router;

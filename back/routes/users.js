// back/routes/users.js
const { Router } = require('express');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');
const router = Router();

/* ========== PERFIL DEL USUARIO AUTENTICADO ========== */
/* ⬅⬅⬅  Colocado antes de '/:id' para no colisionar   */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const me = await User.findById(req.user.id).select('-password');
    if (!me) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(me);
  } catch (e) { next(e); }
});

router.put('/me', verifyToken, async (req, res, next) => {
  try {
    const { name, phone, address, password } = req.body;
    const me = await User.findById(req.user.id);
    if (!me) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (name)     me.name    = name;
    if (phone)    me.phone   = phone;
    if (address)  me.address = address;
    if (password) me.password = password;   // bcrypt en pre-save
    await me.save();

    res.json({ message: 'Perfil actualizado' });
  } catch (e) { next(e); }
});

/* ========== ADMIN: CRUD CLÁSICO ========== */
router.get('/', verifyToken, requireRole(['admin']),
  async (_req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
  });

router.post('/', verifyToken, requireRole(['admin']),
  async (req, res) => {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ error: 'Email ya registrado' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  });

/* ========== FLUJO DE APROBACIÓN ========== */
router.get('/pending', verifyToken, requireRole(['admin']),
  async (_req, res) => {
    const pendings = await User.find({ role: 'pending', approved: false, rejected: false })
                               .select('-password');
    res.json(pendings);
  });

router.put('/:id/approve', verifyToken, requireRole(['admin']),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'No encontrado' });

    user.role = user.roleRequested;
    user.approved = true;
    await user.save();
    res.json({ message: 'Usuario aprobado' });
  });

router.put('/:id/reject', verifyToken, requireRole(['admin']),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'No encontrado' });

    user.rejected = true;
    await user.save();
    res.json({ message: 'Usuario rechazado' });
  });

/* ========== CRUD POR ID (debe ir al final) ========== */
router.put('/:id', verifyToken, requireRole(['admin']),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { name, email, password, role } = req.body;
    Object.assign(user, { name, email, role });
    if (password) user.password = password;
    await user.save();

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  });

router.delete('/:id', verifyToken, requireRole(['admin']),
  async (req, res) => {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  });

module.exports = router;

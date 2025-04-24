// back/routes/users.js
const { Router }            = require('express');
const User                  = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');
const router                = Router();

// GET /api/users  (admin only)
router.get(
  '/',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      // Ocultamos la contraseña
      const users = await User.find().select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/users  (admin only)
router.post(
  '/',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Email ya registrado' });
      }
      const user = new User({ name, email, password, role });
      await user.save();
      // No devolvemos password
      const { _id, name: nm, email: em, role: rl } = user;
      res.status(201).json({ id: _id, name: nm, email: em, role: rl });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/users/:id  (admin only)
router.put(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      const { name, email, password, role } = req.body;
      user.name  = name  ?? user.name;
      user.email = email ?? user.email;
      if (password) user.password = password;
      user.role = role ?? user.role;
      await user.save();
      const { _id, name: nm, email: em, role: rl } = user;
      res.json({ id: _id, name: nm, email: em, role: rl });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

// DELETE /api/users/:id  (admin only)
router.delete(
  '/:id',
  verifyToken,
  requireRole(['admin']),
  async (req, res) => {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

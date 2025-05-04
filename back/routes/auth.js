// back/routes/auth.js
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = require('express').Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, roleRequested } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Datos incompletos' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email ya registrado' });

    const user = await User.create({
      name, email, password, phone, address,
      roleRequested,
      role: 'pending',   // siempre pendiente
      approved: false
    });

    res.status(201).json({ message: 'Solicitud enviada, espere aprobación' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* LOGIN ------------------------------------------------------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

  if (user.role !== 'admin' && !user.approved)
    return res.status(401).json({ error: 'Cuenta pendiente de aprobación' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;

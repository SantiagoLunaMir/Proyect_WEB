// back/routes/auth.js
const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ error: 'User exists' });
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'Registered' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('📥 Datos recibidos en login:', req.body); // Log entrada

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log('🔎 Usuario encontrado:', user);

    if (!user) {
      console.warn('⚠️ Usuario no encontrado');
      return res.status(400).json({ error: 'Bad credentials' });
    }

    const passwordMatch = await user.comparePassword(password);
    console.log('🔐 Contraseña coincide:', passwordMatch);

    if (!passwordMatch) {
      console.warn('⚠️ Contraseña incorrecta');
      return res.status(400).json({ error: 'Bad credentials' });
    }

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('❌ Error interno en login:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

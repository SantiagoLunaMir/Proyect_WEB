const { Router } = require('express');
const jwt         = require('jsonwebtoken');
const User        = require('../models/User');
const router      = Router();

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
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: 'Bad credentials' });
    const payload = { id: user._id, role: user.role };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

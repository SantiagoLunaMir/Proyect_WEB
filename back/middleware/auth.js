const jwt = require('jsonwebtoken');

// Verifica que haya un token y sea válido
function verifyToken(req, res, next) {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Generador de middleware para roles
const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role))
    return res.status(403).json({ error: 'Forbidden' });
  next();
};

module.exports = { verifyToken, requireRole };

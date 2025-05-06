// back/middleware/upload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_')
      .slice(0, 50);
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});

// Solo PNG/JPG ≤ 5 MB
function fileFilter(_req, file, cb) {
  const allowed = ['image/png', 'image/jpeg'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Solo se permiten imágenes PNG o JPG'), false);
  }
  cb(null, true);
}

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

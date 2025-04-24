// back/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const healthRouter = require('./routes/health');
const authRouter   = require('./routes/auth');
const usersRouter  = require('./routes/users');
const doctorsRouter= require('./routes/doctors');
const piecesRouter = require('./routes/pieces');
const worksRouter  = require('./routes/works'); 
const deliveriesRouter = require('./routes/deliveries');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/works', worksRouter);
app.use('/api/pieces', piecesRouter);
app.use('/api/deliveries', deliveriesRouter);
// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Arranca el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});

// back/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Piece = require('./models/Piece');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Piece.deleteMany({});
    await Piece.insertMany([
      {
        name: 'Corona provisional',
        description: 'Corona temporal de resina',
        estimatedTime: '2 días',
        technicianContact: 'técnico1@mail.com'
      },
      {
        name: 'Puente fijo',
        description: 'Puente cerámico de tres piezas',
        estimatedTime: '5 días',
        technicianContact: 'técnico2@mail.com'
      }
    ]);
    console.log('✅ Seed completado');
    process.exit(0);
  })
  .catch(console.error);

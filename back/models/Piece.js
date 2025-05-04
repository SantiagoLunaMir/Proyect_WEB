// back/models/Piece.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pieceSchema = new Schema({
  name:             { type: String, required: true },
  description:      { type: String },
  estimatedTime:    { type: String },
  technicianContact:{ type: String },
  images:           [{ type: String }],   // ← array de URLs o rutas
}, { timestamps: true });

module.exports = model('Piece', pieceSchema);

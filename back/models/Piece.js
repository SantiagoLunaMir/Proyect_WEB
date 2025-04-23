const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pieceSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  estimatedTime: String,
  technicianContact: String
}, { timestamps: true });

module.exports = model('Piece', pieceSchema);

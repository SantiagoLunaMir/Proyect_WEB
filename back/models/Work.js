// back/models/Work.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const workSchema = new Schema({
  pieceId:       { type: Schema.Types.ObjectId, ref: 'Piece',      required: true },
  doctorId:      { type: Schema.Types.ObjectId, ref: 'Doctor',     required: true },
  technicianId:  { type: Schema.Types.ObjectId, ref: 'User',       required: true },
  productionTime:{ type: String,                           required: true },
  deliveryDate:  { type: Date,                             required: true },
  cost:          { type: Number,                           required: true },
  status:        { type: String, enum: ['pending','inProgress','completed'], default: 'pending' }
}, { timestamps: true });

module.exports = model('Work', workSchema);

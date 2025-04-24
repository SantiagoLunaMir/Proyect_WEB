// back/models/Delivery.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const deliverySchema = new Schema({
  workId:         { type: Schema.Types.ObjectId, ref: 'Work',    required: true },
  driverId:       { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  assignedDate:   { type: Date,                            default: Date.now },
  status:         { type: String, enum: ['pending','delivered'], default: 'pending' },
  amountCollected:{ type: Number,                          default: 0 }
}, { timestamps: true });

module.exports = model('Delivery', deliverySchema);

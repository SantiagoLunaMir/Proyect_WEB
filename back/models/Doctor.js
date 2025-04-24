// back/models/Doctor.js
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const doctorSchema = new Schema({
  name:        { type: String, required: true },
  specialty:   { type: String, required: true },
  contactInfo: { type: String },
  notes:       { type: String }
}, { timestamps: true });

module.exports = model('Doctor', doctorSchema);

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },
  address:  { type: String },

  // Nuevo flujo de aprobación
  roleRequested: { type: String, enum: ['technician', 'delivery'], default: 'technician' },
  role:          { type: String, enum: ['admin','technician','delivery','pending'], default: 'pending' },
  approved:      { type: Boolean, default: false },
  rejected:      { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

module.exports = model('User', userSchema);

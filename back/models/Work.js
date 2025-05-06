// back/models/Work.js
const { Schema, model, Types } = require('mongoose');

const workSchema = new Schema(
  {
    pieceId:      { type: Types.ObjectId, ref: 'Piece',  required: true },
    doctorId:     { type: Types.ObjectId, ref: 'Doctor', required: true },

    technicianId: { type: Types.ObjectId, ref: 'User',   default: null },

    productionTime:{ type: String,  required: true },
    deliveryDate:  { type: Date,    required: true },
    cost:          { type: Number,  required: true },

    /* estados de flujo */
    status: {
      type: String,
      enum: ['pending', 'doing', 'done'],     // ← unificamos nombres
      default: 'pending'
    }
  },
  { timestamps: true }
);

workSchema.index({ technicianId: 1 });
workSchema.index({ status: 1 });

module.exports = model('Work', workSchema);

import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pdf: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF', required: true },
    ipAddress: { type: String },
    device: { type: String },
    accessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AccessLog = mongoose.model('AccessLog', accessLogSchema);


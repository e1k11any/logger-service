import mongoose, { Schema, Document } from 'mongoose';
import { LogEntity } from '../../../domain/entities/log.entity';

// Combine Mongoose Document with our Domain Entity
interface LogDocument extends Document, Omit<LogEntity, '_id'> {}

const LogSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true }, // Indexed for filtering
  action: { type: String, required: true },
  meta: { type: Object, default: {} },
  timestamp: { type: Date, required: true },
  processedAt: { type: Date, default: Date.now }, // Auto-set when saved
});

// Compound Index: often we query logs by user AND time
LogSchema.index({ userId: 1, timestamp: -1 });

export const LogModel = mongoose.model<LogDocument>('Log', LogSchema);

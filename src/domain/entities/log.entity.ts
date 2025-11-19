import { ObjectId } from 'mongoose';

export interface LogEntity {
  _id?: ObjectId | string;
  userId: string;
  action: string;
  meta: Record<string, any>;
  timestamp: Date; // Original time from producer
  processedAt?: Date; // Time when consumer saved it
}

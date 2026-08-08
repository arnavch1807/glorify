import mongoose, { Schema, Document } from 'mongoose';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  songId: string;
  playedAt: Date;
  duration?: number;
  progress?: number;
  createdAt: Date;
  updatedAt: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    songId: { type: String, required: true, index: true },
    playedAt: { type: Date, default: Date.now, index: true },
    duration: { type: Number },
    progress: { type: Number },
  },
  { timestamps: true }
);

export const History = mongoose.model<IHistory>('History', HistorySchema);

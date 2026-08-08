import mongoose, { Schema, Document } from 'mongoose';

export interface IDownload extends Document {
  userId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DownloadSchema = new Schema<IDownload>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    songId: { type: Schema.Types.ObjectId, ref: 'Song', required: true, index: true },
  },
  { timestamps: true }
);

// Unique index so a user cannot download the same song multiple times in the db
DownloadSchema.index({ userId: 1, songId: 1 }, { unique: true });

export const Download = mongoose.model<IDownload>('Download', DownloadSchema);

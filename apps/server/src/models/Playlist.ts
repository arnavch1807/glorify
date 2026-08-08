import mongoose, { Schema, Document } from 'mongoose';

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  coverImage?: string;
  songs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    songs: [{ type: String }],
  },
  { timestamps: true }
);

export const Playlist = mongoose.model<IPlaylist>('Playlist', PlaylistSchema);

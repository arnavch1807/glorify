import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  avatarUrl?: string;
  bio?: string;
  genres: string[];
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
    genres: [{ type: String }],
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  },
  { timestamps: true }
);

export const Artist = mongoose.model<IArtist>('Artist', ArtistSchema);

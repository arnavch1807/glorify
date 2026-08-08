import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  artistName: string;
  coverUrl?: string;
  releaseYear: number;
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true, trim: true, index: true },
    artistName: { type: String, required: true, trim: true, index: true },
    coverUrl: { type: String, default: '' },
    releaseYear: { type: Number, required: true },
    songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  },
  { timestamps: true }
);

export const Album = mongoose.model<IAlbum>('Album', AlbumSchema);

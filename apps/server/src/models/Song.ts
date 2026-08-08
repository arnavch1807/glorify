import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number;
  coverImage?: string;
  audioUrl: string;
  lyrics?: string;
  isGenerated: boolean;
  prompt?: string;
  createdBy?: mongoose.Types.ObjectId;
  bpm?: number;
  keySignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true, trim: true, index: true },
    artist: { type: String, required: true, trim: true, index: true },
    album: { type: String, trim: true },
    genre: { type: String, trim: true },
    duration: { type: Number, required: true },
    coverImage: { type: String },
    audioUrl: { type: String, required: true },
    lyrics: { type: String },
    isGenerated: { type: Boolean, default: false },
    prompt: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    bpm: { type: Number },
    keySignature: { type: String },
  },
  { timestamps: true }
);

export const Song = mongoose.model<ISong>('Song', SongSchema);

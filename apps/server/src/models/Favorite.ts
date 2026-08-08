import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: string;
  itemType: 'song' | 'album' | 'artist';
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    itemId: { type: String, required: true, index: true },
    itemType: { type: String, enum: ['song', 'album', 'artist'], required: true, index: true },
  },
  { timestamps: true }
);

// Unique index so a user cannot favorite the same item multiple times
FavoriteSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IEncryptedField {
  encryptedText: string;
  iv: string;
  tag: string;
}

export interface IAPIKey extends Document {
  userId: mongoose.Types.ObjectId;
  sunoKey?: IEncryptedField;
  udioSecret?: IEncryptedField;
  isValidSuno: boolean;
  isValidUdio: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EncryptedFieldSchema = new Schema<IEncryptedField>({
  encryptedText: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
}, { _id: false });

const APIKeySchema = new Schema<IAPIKey>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    sunoKey: { type: EncryptedFieldSchema },
    udioSecret: { type: EncryptedFieldSchema },
    isValidSuno: { type: Boolean, default: false },
    isValidUdio: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const APIKey = mongoose.model<IAPIKey>('APIKey', APIKeySchema);

import mongoose, { Model } from 'mongoose';
import User from './user';

export type PantryItemDocument = {
  _id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

const pantryItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

pantryItemSchema.index({ userId: 1, name: 1 }, { unique: true });

const PantryItem: Model<PantryItemDocument> =
  mongoose.models.PantryItem || mongoose.model<PantryItemDocument>('PantryItem', pantryItemSchema);

export default PantryItem;


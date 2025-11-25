import mongoose, { Model }  from 'mongoose';

export interface UserType {
    _id: string,
    name: string,
    email: string,
    image: string,
    emailVerified: string | null,
    createdAt: string,
    subscription?: {
        plan: 'basic' | 'premium' | 'pro',
        status: 'active' | 'inactive' | 'cancelled',
        startDate: Date,
        endDate: Date,
        gcashAccount?: string,
    },
}

// define the schema for our user model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: String || null,
  subscription: {
    plan: { type: String, enum: ['basic', 'premium', 'pro'] },
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
    startDate: Date,
    endDate: Date,
    gcashAccount: String,
  },
}, { timestamps: true });

const User: Model<UserType> = mongoose.models.User || mongoose.model<UserType>('User', userSchema);

export default User
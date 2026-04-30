import mongoose, { Model }  from 'mongoose';
import User from './user';
import { RecipeDocument } from '../types/index'

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: User },
    comment: { type: String, required: true },
}, {
    timestamps: true,
});

const tagSchema = new mongoose.Schema({
    tag: { type: String, required: true },
});

const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: String || undefined, required: true },
});

const recipeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: User, index: true },
    name: { type: String, required: true },
    ingredients: [ingredientSchema],
    instructions: [{ type: String, required: true }],
    dietaryPreference: [{ type: String, required: true }],
    additionalInformation:{
        tips: { type: String, required: true },
        variations: { type: String, required: true },
        servingSuggestions: { type: String, required: true },
        nutritionalInformation: { type: String, required: true },
    },
    imgLink: { type: String },
    openaiPromptId: {type: String, required: true, index: true},
    likedBy: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: User }],
        default: [],
        index: true
    },
    comments: {
        type: [commentSchema],
        default: [],
    },
    tags: {
        type: [tagSchema],
        default: [],
        index: true
    },
    audio: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

const Recipe: Model<RecipeDocument> = mongoose.models.Recipe || mongoose.model<RecipeDocument>('Recipe', recipeSchema);

export default Recipe;
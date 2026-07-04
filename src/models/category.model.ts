import mongoose, { Document, Schema } from "mongoose";

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }
}, {
    timestamps: true,
});

export interface ICategory extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);

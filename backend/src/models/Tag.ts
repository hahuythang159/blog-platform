import mongoose, { Document, Schema } from "mongoose";

export interface ITag extends Document {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITag>('Tag', TagSchema);
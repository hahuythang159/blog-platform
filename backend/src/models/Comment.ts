import mongoose, { Schema, Document, Types } from "mongoose";

export interface IComment extends Document {
    content: string;
    post: Types.ObjectId;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
            index: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IComment>("Comment", CommentSchema);

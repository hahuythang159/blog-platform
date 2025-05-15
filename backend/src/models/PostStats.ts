import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPostStats extends Document {
    post: Types.ObjectId;
    likes: Types.ObjectId[];
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const PostStatsSchema = new Schema<IPostStats>(
    {
        post: { type: Schema.Types.ObjectId, ref: "Post", required: true, unique: true },
        likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IPostStats>("PostStats", PostStatsSchema);

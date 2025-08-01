import mongoose, { Schema, Document } from "mongoose";
import applyPostCascadeDelete from "../middlewares/postCascadeDelete";
import { applyPostVirtuals } from "./virtuals/post.virtuals";

export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    tags?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }]
    },
    {
        timestamps: true
    }
)
applyPostVirtuals(PostSchema);
applyPostCascadeDelete(PostSchema);
PostSchema.index({ title: "text", content: "text" });

export default mongoose.model<IPost>("Post", PostSchema);
import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUserInteraction extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    tags: Types.ObjectId;
    type: 'view' | 'like' | 'comment';
    createdAt: Date
}

export const UserInteractionSchema = new Schema<IUserInteraction>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        post: { type: Schema.Types.ObjectId, ref: 'Post', index: true },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        type: { type: String, enum: ['view', 'like', 'comment'], required: true }

    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
)

UserInteractionSchema.index({ user: 1, post: 1, type: 1 })

export default mongoose.model<IUserInteraction>('UserInteraction', UserInteractionSchema)
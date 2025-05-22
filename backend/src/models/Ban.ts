import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBan extends Document {
    user: Types.ObjectId;
    reason: string;
    bannedBy?: Types.ObjectId;
    isActive: boolean;
    timestamp: Date;
}

const BanSchema: Schema<IBan> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    bannedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IBan>("Ban", BanSchema);
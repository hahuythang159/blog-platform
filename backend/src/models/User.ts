import mongoose, { Schema, Document, Types } from "mongoose";
import applyUserCascadeDelete from "../middlewares/userCascadeDelete";

export interface IUser extends Document {
    _id: Types.ObjectId;
    username: string;
    email: string;
    profile: mongoose.Types.ObjectId;
    password: string;
}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        profile: { type: Schema.Types.ObjectId, ref: "Profile" },
        password: { type: String, required: true }
    },
    {
        timestamps: true
    }
)

applyUserCascadeDelete(UserSchema);

export default mongoose.model<IUser>("User", UserSchema);
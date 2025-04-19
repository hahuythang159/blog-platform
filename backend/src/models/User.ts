import mongoose, {Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId; 
    username: string;
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema (
    {
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

export default mongoose.model<IUser>("User", UserSchema);
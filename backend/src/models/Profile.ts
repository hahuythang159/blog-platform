import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProfile extends Document {
  user: Types.ObjectId;
  avatarData?: Buffer,
  avatarType?: string,
  bio?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  birthday?: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    avatarData: { type: Buffer },
    avatarType: { type: String },
    bio: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    birthday: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);

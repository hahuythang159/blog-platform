import { Schema } from "mongoose";

export const applyPostVirtuals = (postSchema: Schema) => {
    postSchema.virtual("comments", {
        ref: "Comment",
        localField: "_id",
        foreignField: "post",
    });

    postSchema.set("toObject", { virtuals: true });
    postSchema.set("toJSON", { virtuals: true });
};

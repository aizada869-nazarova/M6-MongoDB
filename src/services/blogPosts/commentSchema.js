import mongoose from "mongoose"

const { Schema, model } = mongoose

const commentSchema = new Schema(
  {
    comment: { type: String, required: true },
    
  },
  { timestamps: true }
)

export default model("comments", commentSchema)

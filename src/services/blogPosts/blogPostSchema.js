import mongoose from "mongoose"

const { Schema, model } = mongoose

const blogPostSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
        value: {Number},
        unit:{ String}, 
      },
      author: {
        name: { String },
        avatar:{ String },
      },
      content: { type: String, required: true },

  },
  {
    timestamps: true, 
  }
)

export default model("blogPost", blogPostSchema)
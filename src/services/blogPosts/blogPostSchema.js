import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: Number,
      unit: String,
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String, required: true },
    comments: [{ comment: { type: String, required: true } }],
  },
  {
    timestamps: true,
  }
);

// blogPostSchema.static("findBlogsWithAuthors", async function (query) {
  
//   const total = await this.countDocuments(query.criteria)
//   const blogs = await this.find(query.criteria)
//     .limit(query.options.limit || 10)
//     .skip(query.options.skip || 0)
//     .sort(query.options.sort)
//     .populate({ path: "authors", select: "name avatar" })

//   return { total, blogs }
// })



export default model("blogPost", blogPostSchema);

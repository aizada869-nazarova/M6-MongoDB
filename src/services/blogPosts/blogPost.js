import express from "express"
import createHttpError from "http-errors"
import blogPostModel from "./blogPostSchema.js"

const blogPostRouter = express.Router()

blogPostRouter.post("/", async (req, res, next) => {
  try {
    const newBlog = new blogPostModel(req.body) 
    const { _id } = await newBlog.save() 

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await blogPostModel.find()
    res.send(blogs)
  } catch (error) {
    next(error)
  }
})

blogPostRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const blog = await blogPostModel.findById(blogId)
    if (blog) {
      res.send(blog)
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const updatedblog = await blogPostModel.findByIdAndUpdate(blogId, req.body, { new: true }) // by default findByIdAndUpdate returns the document pre-update, if I want to retrieve the updated document, I should use new:true as an option
    if (updatedblog) {
      res.send(updatedblog)
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId
    const deletedblog = await blogPostModel.findByIdAndDelete(blogId)
    if (deletedblog) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `blog with id ${blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default blogPostRouter
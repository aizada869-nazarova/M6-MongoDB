import express from "express"
import createHttpError from "http-errors"
import blogPostModel from "./blogPostSchema.js"
import commentsModel from "./commentSchema.js"
import q2m from "query-to-mongo"

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
    const mongoQuery = q2m(req.query)
  //   const { total, blogs } = await blogPostModel.findBlogsWithAuthors(mongoQuery)
  //   res.send({ links: mongoQuery.links("/blogs", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, blogs })
  const blogId = req.params.blogId

  const blog = await blogPostModel.find(blogId).populate({ path: "authors", select: "name avatar" })
  if (blog) {
    res.send(blog)
  } else {
    next(createHttpError(404, `blog with id ${blogId} not found!`))
  }
  } catch (error) {
    next(error)
  }
})

blogPostRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogId = req.params.blogId

    const blog = await blogPostModel.findById(blogId).populate({ path: "authors", select: "name avatar" })
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
    const updatedblog = await blogPostModel.findByIdAndUpdate(blogId, req.body, { new: true })
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


blogPostRouter.post("/:blogId", async (req, res, next)=>{
  try {  const newComments = await new commentsModel(req.body) 
    const { _id } = await newComments.save()
   
  if (newComments) {
   
    const commentToInsert = { ...newComments.toObject()} 
    console.log(commentToInsert)

    const modifiedBlog = await blogPostModel.findByIdAndUpdate(
      req.params.blogId,
      { $push: { comments: commentToInsert } }, 
      { new: true } 
    )
    if (modifiedBlog) {
      res.send(modifiedBlog)
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } else {
    next(createHttpError(404, `Blog with id ${req.body.blogId} not found!`))
  }
  } catch (error) {
    next(error)
    
  }
})

blogPostRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    console.log(req.params.blogId)
    const blog = await blogPostModel.findById(req.params.blogId)
    if (blog) {
      res.send(blog.comments)
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await blogPostModel.findById(req.params.blogId)
    if (blog) {
      const purchasedItem = blog.comments.find(book => book._id.toString() === req.params.commentId) // You CANNOT compare an ObjectId (book._id) with a string (req.params.commentId) --> book._id needs to be converted into a string
      if (purchasedItem) {
        res.send(purchasedItem)
      } else {
        next(createHttpError(404, `Book with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await blogPostModel.findById(req.params.blogId)
    if (blog) {
      const index = blog.comments.findIndex(book => book._id.toString() === req.params.commentId)

      if (index !== -1) {
       
        blog.comments[index] = { ...blog.comments[index].toObject(), ...req.body } 
        await blog.save() 
        res.send(blog)
      } else {
        next(createHttpError(404, `comment with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
  try {
    const modifiedblog = await blogPostModel.findByIdAndUpdate(
      req.params.blogId, 
      { $pull: { comments: { _id: req.params.commentId } } }, 
      { new: true } 
    )

    if (modifiedblog) {
      res.send(modifiedblog)
    } else {
      next(createHttpError(404, `blog with id ${req.params.blogId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
export default blogPostRouter
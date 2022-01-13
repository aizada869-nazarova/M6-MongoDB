import express from "express";
import createHttpError from "http-errors"
import AuthorModel from "./authorsSchema.js";

const authorsRouter = express.Router()

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/", async (req, res, next) => {
  try {  const authors = await AuthorModel.find()
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorId", async (req, res, next) => {
  try { const authorId = req.params.authorId

    const author = await AuthorModel.findById(authorId)
    if (author) {
      res.send(author)
    } else {
      next(createHttpError(404, `author with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/:authorId", async (req, res, next) => {
  try {const authorId = req.params.authorId

    const authorUpdated = await AuthorModel.findByIdAndUpdate(authorId, req.body, {new:true})
    if (authorUpdated) {
      res.send(authorUpdated)
    } else {
      next(createHttpError(404, `author with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try {const authorId = req.params.authorId

    const authorDeleted = await AuthorModel.findByIdAndDelete(authorId)
    if (authorDeleted) {
      res.send('ok')
    } else {
      next(createHttpError(404, `author with id ${authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter


import express from "express"
import createHttpError from "http-errors"
import UsersModel from "./userSchema.js"
import { basicAuthMiddleware } from "../auth/basic.js"
import { adminOnlyMiddleware } from "../auth/admin.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new UsersModel(req.body)
    const { _id } = await user.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get(
  "/",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await UsersModel.find()
      res.send(users)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    req.user.name = "John"
    await req.user.save()
    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
  res.send(req.user)
})

usersRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.send()
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:userId", basicAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.put(
  "/:userId",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(req.params.userId)
      if (user) {
        res.send(user)
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.delete(
  "/:userId",
  basicAuthMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByIdAndDelete(req.params.userId)
      if (user) {
        res.status(204).send()
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

export default usersRouter
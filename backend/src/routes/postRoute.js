import { Router } from "express"
import postController from "../controllers/postController.js"

const postRouter = Router()

postRouter.get('/posts', postController.getAllPosts)
postRouter.get('/posts/:post_id', postController.getPostById)
postRouter.post('/posts', postController.insertPost)
postRouter.patch('/posts/:post_id', postController.updatePost)
postRouter.delete('/posts/:post_id', postController.deletePost)

export default postRouter
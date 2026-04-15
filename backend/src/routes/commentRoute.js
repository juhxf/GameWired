import { Router } from "express"
import commentController from "../controllers/commentController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const commentRouter = Router()

commentRouter.get('/comentarios', commentController.getAllComments)
commentRouter.get('/comentarios/:comentario_id', commentController.getCommentById)
commentRouter.get('/comentarios/:comentario_id/me', verifyToken, commentController.getCommentByIdAndUser)
commentRouter.post('/comentarios', verifyToken, commentController.insertComment)
commentRouter.patch('/comentarios/:comentario_id', verifyToken, commentController.updateComment)
commentRouter.delete('/comentarios/:comentario_id', verifyToken, commentController.deleteComment)

export default commentRouter
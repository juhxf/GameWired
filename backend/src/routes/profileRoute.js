import { Router } from "express"
import profileController from "../controllers/profileController.js"
import { uploadPerfil } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const profileRoute = Router()

profileRoute.get('/profile', verifyToken, profileController.getPerfilById)
profileRoute.put('/profile', verifyToken, uploadPerfil.single("foto_perfil"), profileController.updateProfile)

export default profileRoute
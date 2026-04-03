import { Router } from "express"
import profileController from "../controllers/profileController.js"
import { upload } from "../config/cloudinary.js"

const profileRoute = Router()

profileRoute.get('/profile/:id',profileController.getPerfilById)
profileRoute.put('/profile/update/:id', upload.single("foto_perfil"), profileController.updateProfile)

export default profileRoute
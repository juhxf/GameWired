import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET
})

console.log("CLOUD:", process.env.CLOUDINARY_CLOUDNAME)

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gamewired/perfil",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
})

export const upload = multer({ storage })

export default cloudinary
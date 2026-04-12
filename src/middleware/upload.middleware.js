import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// 🔥 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 Storage config (THIS is where upload happens)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",         // folder name in cloudinary
    resource_type: "raw",      // 🔥 IMPORTANT for PDFs
    allowed_formats: ["pdf"],
  },
});

// 🔥 Multer setup
export const upload = multer({
  storage,
});
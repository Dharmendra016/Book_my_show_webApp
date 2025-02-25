import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Cloudinary first
const cloudinaryInstance = cloudinary.v2;
cloudinaryInstance.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure Cloudinary is initialized before creating storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinaryInstance, // Use the initialized Cloudinary instance
    params: {
        folder: "event_images", // Folder in Cloudinary
        allowed_formats: ["jpg", "png", "jpeg"],
        transformation: [{ width: 800, height: 600, crop: "limit" }],
    },
});

const upload = multer({ storage });

export { upload, cloudinaryInstance as cloudinary };

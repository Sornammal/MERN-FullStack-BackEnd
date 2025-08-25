import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Setup __dirname manually for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const location = req.body.folder ? ['uploads', req.body.folder] : ['uploads'];

//         // ✅ Full absolute path
//         const dest = path.join(__dirname, ...location);

//         // ✅ Ensure directory exists
//         fs.mkdirSync(dest, { recursive: true });

//         cb(null, dest);
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // unique filename
//     }
// });

// Init upload


// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) return cb(null, true);
    cb('Error: Images Only!');
}

export const getImage = (callback) => {
    const uploadDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return callback(err); // return error through callback
        }

        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif)$/i.test(file)
        );

        const imageUrls = imageFiles.map(
            filename => `/uploads/${filename}`
        );

        return callback(null, { images: imageUrls }); 
    });
};
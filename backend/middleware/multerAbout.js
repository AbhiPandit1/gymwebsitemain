import multer from 'multer';
import path from 'path';

// Define storage settings for the "about" section
const aboutStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'about-images/'); // Ensure this folder exists or create it
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp and file extension
  },
});

// Create the multer middleware for single file upload specific to the "about" section
const aboutUpload = multer({ storage: aboutStorage }).single('aboutImage'); // Field name for "about" section uploads

export { aboutUpload };

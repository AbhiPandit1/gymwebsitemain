import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Images'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File naming scheme
  },
});




const singleUpload = multer({ storage }).single('profilePhoto'); // Middleware for single file upload

export default singleUpload;

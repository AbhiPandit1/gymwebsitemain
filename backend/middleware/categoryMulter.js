import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Get current module's path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory path for uploads
const uploadDir = join(__dirname, '../Images/category');

// Ensure upload directory exists. Create if it doesn't.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer middleware for single file upload
const categoryImageUpload = multer({ storage }).single('categoryPhoto');

export { categoryImageUpload };

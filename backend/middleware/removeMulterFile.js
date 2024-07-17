import fs from 'fs';
import path from 'path';

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
};

export default deleteFile;

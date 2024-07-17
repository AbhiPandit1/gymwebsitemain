import cloudinary from 'cloudinary';
import fs from 'fs';

async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath.path, {
      folder: 'profile_photos', // Optional - specify a folder in Cloudinary
      resource_type: 'auto', // Automatically detect the resource type (image/video/raw)
    });
    fs.unlinkSync(filePath.path);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Handle the error as per your application's needs
  }
}

export default uploadToCloudinary;

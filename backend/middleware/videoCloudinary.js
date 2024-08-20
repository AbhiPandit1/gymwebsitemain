import cloudinary from 'cloudinary';
import fs from 'fs';

async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'programme_videos',
      resource_type: 'video', // Specify that the resource type is video
    });
    fs.unlinkSync(filePath); // Remove the file from the server after uploading
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Handle the error as per your application's needs
  }
}

export default uploadToCloudinary;

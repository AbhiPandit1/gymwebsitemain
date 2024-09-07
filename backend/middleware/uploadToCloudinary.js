import cloudinary from 'cloudinary';
import fs from 'fs';

// Function to upload to a specific folder in Cloudinary
async function uploadToCloudinary(filePath, folderName) {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: folderName, // Specify folder dynamically
      resource_type: 'auto', // Automatically detect the resource type (image/video/raw)
    });
    fs.unlinkSync(filePath); // Remove file after upload
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Handle the error as per your application's needs
  }
}

// Function to upload profile photos
export async function uploadProfilePhoto(filePath) {
  return uploadToCloudinary(filePath, 'profile_photos');
}

// Function to upload trainer photos
export async function uploadTrainerPhoto(filePath) {
  return uploadToCloudinary(filePath, 'trainer_photos');
}

// Function to upload programme photos
export async function uploadProgrammePhoto(filePath) {
  return uploadToCloudinary(filePath, 'programme_photos');
}

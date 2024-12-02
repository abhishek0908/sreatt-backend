import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'; // For streaming buffers to Cloudinary

class StorageService {
  constructor() {
    // Initialize Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload an image to Cloudinary.
   * @param {Buffer} fileBuffer - Buffer containing file data.
   * @param {string} fileName - Optional custom file name.
   * @returns {Promise<Object>} - Cloudinary upload response.
   */
  async uploadImage(fileBuffer, fileName = null) {
    if (!fileBuffer) {
      throw new Error('No file buffer provided for upload.');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName, folder: 'sreatt-product' }, // Optional: Set folder and public ID
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Stream the buffer to Cloudinary
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Delete an image from Cloudinary.
   * @param {string} publicId - The public ID of the image to delete.
   * @returns {Promise<Object>} - Cloudinary deletion response.
   */
  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      // Check the result to ensure the image was deleted
      if (result.result !== 'ok') {
        throw new Error(`Failed to delete image: ${publicId}`);
      }
  
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error.message || error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }
  
}

export default StorageService;

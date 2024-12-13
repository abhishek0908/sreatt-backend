import multer from 'multer';
import StorageService from '../services/storageService.js';
import path from 'path';
import Product from '../db/product.model.js'
import { v4 as uuidv4 } from 'uuid'; // ESM import syntax
import StatusCodes from '../utils/statusCodes.js';
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 7 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only .png, .jpg, .jpeg, and .gif formats are allowed.'));
    }
    cb(null, true);
  },
});

export const addProduct = async (req, res) => {
  try {
    upload.array('file', 7)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error uploading file', details: err.message });
      }

      const files = req.files;
      const { productName, productDescription, price, category } = req.body;

      // Create a new product object with the text fields
      const product = new Product({
        productName,
        productDescription,
        price,
        category,  // Make sure you are sending the category in the request
      });

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No images provided.' });
      }

      const storageService = new StorageService();
      const imageUrls = [];

      for (const file of files) {
        // const fileExtension = path.extname(file.originalname); // Get the file extension
        const uniqueFileName = `${uuidv4()}`; // Generate a unique file name with the extension
        
        const uploadResult = await storageService.uploadImage(
          file.buffer,
          uniqueFileName
        );

        if (!uploadResult || !uploadResult.secure_url) {
          return res.status(500).json({ error: 'Failed to upload some images to Cloudinary.' });
        }

        imageUrls.push(uploadResult.secure_url);
      }

      // Update the product with the image URLs and save it
      product.images = imageUrls;
      await product.save();

      res.status(201).json({
        message: 'Images uploaded successfully',
        imageUrls,
      });
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      error: 'Failed to upload images',
      details: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Assuming you're passing the product ID in the URL
    console.log(req.query);
    console.log(productId);
    
    // Step 1: Find the product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Step 2: Delete images from Cloudinary
    const imageUrls = product.images;

    if (imageUrls.length > 0) {
      for (let imageUrl of imageUrls) {
        console.log('Deleting image: ', imageUrl);
        
        // Extract the public_id from the Cloudinary URL
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.jpg
        const publicId = imageUrl.split('/').slice(-2, -1).join('/') + '/' + path.parse(imageUrl.split('/').pop()).name;  // Extract the publicId without extension
        
        console.log('Extracted publicId: ', publicId);

        try {
          // Delete image from Cloudinary
          const storageService = new StorageService();
          await storageService.deleteImage(publicId);  // Make sure you await the deletion
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error);
        }
      }
    }

    // Step 3: Delete the product from the database
    await Product.findByIdAndDelete(productId);

    // Step 4: Respond with a success message
    res.status(200).json({
      message: 'Product and images deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      error: 'Failed to delete product',
      details: error.message,
    });
  }
};


export const getProduct = async (req, res) => {
  try {
      // Get page and limit from query parameters, with defaults
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
      const skip = (page - 1) * limit;  // Number of items to skip for pagination

      // Query to get products with pagination
      const products = await Product.find()
          .skip(skip)
          .limit(limit);

      // Get total number of products for pagination metadata
      const totalProducts = await Product.countDocuments();

      // Calculate total pages
      const totalPages = Math.ceil(totalProducts / limit);

      // Send response with products and pagination info
      res.status(StatusCodes.OK).json({
          currentPage: page,
          totalPages: totalPages,
          totalProducts: totalProducts,
          products: products,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
};



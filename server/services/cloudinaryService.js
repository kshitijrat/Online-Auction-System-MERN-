import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config(); // just this, no .parsed

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file) => {
  try {
    console.log("Uploading file:", file.path);
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'auctions',
    });
    console.log("Uploaded URL:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw new Error('Error uploading image to Cloudinary');
  }
};

export default uploadImage;

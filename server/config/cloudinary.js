const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createStorage = (folder, resourceType = 'auto') =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `videoportfolio/${folder}`,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'svg', 'pdf'],
    },
  });

const uploadImage = multer({
  storage: createStorage('images'),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const uploadVideo = multer({
  storage: createStorage('videos', 'video'),
  limits: { fileSize: 200 * 1024 * 1024 },
});

const uploadAny = multer({
  storage: createStorage('media'),
  limits: { fileSize: 200 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadImage, uploadVideo, uploadAny };

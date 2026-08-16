const cloudinary = require('./cloudinary');
// fs removed — no local file to delete, buffer lives in memory

/**
 * Upload an image buffer to Cloudinary

 *
 * @param {Buffer} buffer - Raw image bytes from req.file.buffer (Multer memoryStorage)
 * @param {string} folder - Cloudinary folder (e.g. 'energen/blogs', 'energen/products')
 * @returns {Promise<string>} - Secure Cloudinary URL
 */
const uploadToCloudinary = (buffer, folder = 'ondrivo') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        use_filename: false,     // no filename available from buffer, so false
        unique_filename: true,
        transformation: [
          {
            width: 800,
            height: 800,
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto'
          }
        ]
      },
      (err, result) => {
        if (err) {
          console.error('❌ Cloudinary upload error:', err);
          return reject(err);
        }
        // same return as before — secure_url string
        resolve(result.secure_url);
      }
    );

    // push the buffer into the stream — this triggers the upload
    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;
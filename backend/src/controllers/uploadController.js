// @route   POST /api/uploads  (multipart/form-data, field name: "image")
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(200).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage };

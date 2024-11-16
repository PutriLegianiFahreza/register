const multer = require('multer');

// Menyimpan file di folder 'uploads/photos'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/photos/'); // Folder tempat foto akan disimpan
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Menambahkan timestamp untuk nama file unik
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
    cb(null, true);
  }
});


module.exports = upload;

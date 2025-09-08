const multer = require('multer');
const path = require('path');

// Storage config: uploads/ मध्ये unique filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
module.exports = upload;



// const multer = require('multer');
// const path = require('path');

// // Storage config: uploads/ मध्ये unique filename
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   }
// });

// // fileFilter: फक्त images allow करा
// const fileFilter = (req, file, cb) => {
//   const allowed = /jpeg|jpg|png|gif/;
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowed.test(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'), false);
//   }
// };

// // limits: file size मर्यादा (उदा. 5MB)
// const limits = { fileSize: 5 * 1024 * 1024 };

// const upload = multer({ storage, fileFilter, limits });
// module.exports = upload;

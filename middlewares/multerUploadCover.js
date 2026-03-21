const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cover');
    },

    filename: (req, file, cb) => {
        const uniqueName =
        Date.now() + '-' + Math.round(Math.random() * 1E9);

        const extension = path.extname(file.originalname);
        cb(null, uniqueName + extension);

    }
    });

const upload = multer({ storage });

module.exports = upload;
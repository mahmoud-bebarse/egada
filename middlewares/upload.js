
const path = require('path');
const multer = require("multer");
const { fileURLToPath } = require('url');


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.')[1]}`)
    }
})

const multiple = multer({ storage: storage }).array("imgs", 10)

const single = multer({ storage: storage }).single("img")

const file = multer({ storage: storage }).single("file")

module.exports = { multiple, single, file }
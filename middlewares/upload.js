const path = require("path");
const multer = require("multer");
// const { fileURLToPath } = require("url");

// const _filename = fileURLToPath(import.meta.url);
console.log("__filename", __filename);
const _dirname = path.dirname(__filename);
console.log(_dirname);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(_dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${file.originalname.split(".")[1]}`
    );
  },
});

/*
    @description: uploading multiple photos
*/
const multiple = multer({ storage: storage }).array("imgs", 10);

/*
    @description: upload single photo
*/
const single = multer({ storage: storage }).single("img");

const file = multer({ storage: storage }).single("file");

module.exports = { multiple, single, file };

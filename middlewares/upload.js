const path = require("path");
const multer = require("multer");
const _dirname = path.dirname(__filename);
const { google } = require('googleapis');
const stream = require('stream');



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

const googleDriveUpload = multer(); 
const driveUpload = async (req, res, next) => {
  googleDriveUpload.single("img")(req, res, async (err) => {
    if(err){
      return next(err);
    }

    req.file = renameFile(req.file);
    try {

      const fileId = await uploadBasic(req.file);
      req.fileId = fileId;
      next();
    }
    catch(err){
      next(err);
    }
  });
};

/**
 * Insert new file.
 * @return{obj} file Id
 * */
const uploadBasic = async (fileObject) => {

  const CREDENTIALS_PATH = path.join(process.cwd(), 'config/egada.json');
  const {GoogleAuth} = require('google-auth-library');
  const auth = new GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.appdata',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });
  const service = google.drive({version: 'v3', auth});
  
  const requestBody = {
    name: fileObject.fileName,
    fields: 'file',
  };

  const fs = require('fs');
  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(fileObject.buffer));

  const media = {
    mimeType: fileObject.mimetype,
    body: bufferStream, 
  };

  try {
    const {data} = await service.files.create({
      requestBody,
      media: media,
      parents: ['1zuIlyRu_y4zi4d8cQ0CzhAV6_AbQ51GS'],
      fields: "id,name"
    });

    console.log(`filename ${data.name} with fileid: ${data.id} uploaded successfully`)
    
    return data.id;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

/**
 * 
 * @param {file} fileObject 
 * @description renamiing file
 * @returns {file}
 */
const renameFile = (file) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `${file.fieldname}-${uniqueSuffix}.${file.originalname.split(".")[1]}`
  const renamed = {
    ...file,
    fileName,
  };
  return renamed;
};


const imgStorage = multer.memoryStorage();
const img = multer({ storage: imgStorage }).single("img");
module.exports = { multiple, single, file, googleDriveUpload, img};

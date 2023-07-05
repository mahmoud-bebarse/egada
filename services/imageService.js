const _image = require("../models/image");

/**
 * @description getImages
 */
const getImages = async () => {
  const images = await _image.find({ status: true });
  return images;
};

/**
 * @description getImageById
 * @param id: ObjectID
 */
const getImageById = async (id) => {
  const image = await _image.findOne({ _id: id, status: true });
  return image;
};

/**
 * @description postImage
 * @param file: file
 */
const postImage = async (file) => {
  const renamed = renameFile(file);
  try {
    // const res = await uploadBasic(renamed);
    const image = new _image({ 
      fileName: renamed.fileName, 
      image: {
        data: file.buffer,
        contentType: file.mimetype,
      }, 
    });

    const result = await image.save();
    return result;
  } catch (err) {
    return err;
  }
};


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


/**
 * @description deleteImage
 * @param id: ObjectID
 */
const deleteImage = async (id) => {
  const image = await _image.findByIdAndDelete(
    { _id: id , status: true }
  );
  return image
};

const deleteAll = async () => {
  await _image.find().deleteMany();
}

const updateImage = async (id, fileName) => {
  const image = await _image.findOneAndUpdate(
    { $and: [{ _id: id }, { status: true }] },
    { fileName: fileName },
    {
      useFindAndModify: false,
      new: true,
    }
  );
  return image;
};

module.exports = {
  getImages,
  getImageById,
  postImage,
  deleteImage,
  deleteAll,
  updateImage,
};

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
const postImage = async (fileName) => {
  const image = new _image({ fileName });
  try {
    const result = await image.save();
    return result;
  } catch (err) {
    return err;
  }
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
  updateImage,
};

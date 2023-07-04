const { Error } = require("../models/error");
const { Response } = require("../models/response");

const imageService = require("../services/imageService.js");

const getImages = async (req, res, next) => {
  const images = await imageService.getImages();
  if (!images) {
    res.status(200).send(Response(false, {}, "There is no image"));
  } else {
    // res.render('images', { images: images });
    res.status(200).send(Response(true, images, ""));
  }
};

const deleteImage = async (req, res, next) => {
  try {
    await imageService.deleteImage(req.params.id);
    res
      .status(200)
      .send(Response(true, {}, "image has been deleted successfully"));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
};

const deleteAll = async (req, res, next) => {
  try {
    await imageService.deleteAll();
    res
      .status(200)
      .send(Response(true, {}, "images has been deleted successfully"));
  } catch (err) {
    res.status(500).send(Response(false, {}, err.message));
  }
}

const getImageById = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).send(Response(false, {}, "Missing params"));
  } else {
    try {
      const image = await imageService.getImageById(id);
      if (!image) {
        res.status(200).send(Response(false, {}, "No such image"));
      } else {
        res.status(200).send(Response(true, image, ""));
      }
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

const postImage = async (req, res, next) => {
  const { file } = req; 
  console.warn('file', file);
  try {
    const result = await imageService.postImage(file);
    
    
    res.status(200).send(Response(true, result, ""));
  } catch (err) {
    res.status(400).send(Response(false, {}, err.message));
  }
};

const updateImage = async (req, res, next) => {
  const { id } = req.params;
  const { fileName } = req.file.filename;
  if (!id || !fileName) {
    res.status(200).send(Response(false, {}, "missing data"));
  } else {
    try {
      const result = await imageService.updateImage(id, fileName);
      res.status(200).send(Response(true, result, err.message));
    } catch (err) {
      res.status(500).send(Response(false, {}, err.message));
    }
  }
};

module.exports = {
  getImages,
  getImageById,
  postImage,
  deleteImage,
  deleteAll,
  updateImage,
};

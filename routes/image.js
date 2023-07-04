const express = require("express");
const imageController = require("../controllers/imageController.js");
const { img } = require("../middlewares/upload.js");

const router = express.Router();

router.get("/all", imageController.getImages);
router.post("/", img, imageController.postImage);
router.delete("/:id", imageController.deleteImage);
router.get("/:id", imageController.getImageById);
router.put("/:id",single , imageController.updateImage);
router.delete("/delete/all", imageController.deleteAll);

module.exports = router;

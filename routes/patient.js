const express = require("express");
const userController = require("../controllers/userController.js");
const { authorize } = require("../middlewares/authorize.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

module.exports = router; 
const express = require('express');
const userController = require('../controllers/userController.js');
const { authorize } = require('../middlewares/authorize.js');
const { verifyToken } = require('../middlewares/auth.js');

const router = express.Router();


//User
router.get(
    '/all',
    userController.getUsers
);

/* GET users listing. using authrization middleware */
// router.get(
//     '/all', 
//     verifyToken,
//     authorize([
//         "Administration/Admin", 
//         "Administration/Operator", 
//         "Company/Admin", 
//         "Gas Station/Admin"
//     ]), 
//     userController.getUsers
// );



module.exports = router; 
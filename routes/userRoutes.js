const express = require('express');
const router = express.Router();
const userCon = require('./../controllers/authController');
const Usercon = require('./../controllers/userController');

router
.route('/signup')
.post(userCon.signup);

router
.route('/login')
.post(userCon.login);

router
.route('/')
.get(Usercon.getAllUsers);
module.exports = router;
const express = require('express');
const router = express.Router();
const userCon = require('./../controllers/userController');


router.
route('/')
.get(userCon.getAllUsers)
.post(userCon.createUsers);

router
.route('/:id')
.get(userCon.getUserById)
.patch(userCon.updateUser)
.delete(userCon.deleteUser);

module.exports = router;
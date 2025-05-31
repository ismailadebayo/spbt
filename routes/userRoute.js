const express = require('express');
const router = express.Router();

const { createUser, userLogin, getUsers } = require('../controllers/userController');

router.post('/create-user', createUser);
router.post('/user-login/', userLogin);
router.get('/get-users', getUsers);


module.exports = router;
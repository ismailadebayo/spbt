// routes/admin.js
const express = require('express');
const router = express.Router();
const {payOut, createGame }= require('../controllers/adminController')
const isAdmin = require('../middleware/auth');



// Admin sets result
router.post('/set-result', isAdmin, payOut );
router.post('/create-game', isAdmin, createGame );


module.exports = router;

// routes/events.js
const express = require('express');
const router = express.Router();

const  gameResult  = require('../controllers/gameController');

router.get('/game-result', gameResult);

module.exports = router;

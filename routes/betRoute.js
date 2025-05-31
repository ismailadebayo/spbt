// routes/bet.js
const express = require('express');
const router = express.Router();


const {placeBet, betHistory} = require('../controllers/betController')

// Place a bet
router.post('/place-bet', placeBet);
router.get('/history', betHistory);

module.exports = router;



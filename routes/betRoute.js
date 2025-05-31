// routes/bet.js
const express = require('express');
const router = express.Router();


const {placeBet, betHistory, betResult} = require('../controllers/betController')

// Place a bet
router.post('/place-bet', placeBet);
router.get('/bet-history', betHistory);
router.get('/bet-result/:betId', betResult);



module.exports = router;



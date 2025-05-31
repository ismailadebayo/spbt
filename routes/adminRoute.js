// routes/admin.js
const express = require('express');
const router = express.Router();
const payOut = require('../controllers/adminController')

function isAdmin(req, res, next) {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Unauthorized' });
}

// Admin sets result
router.post('/set-result', isAdmin, payOut );

module.exports = router;

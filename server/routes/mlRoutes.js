const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
// No auth required for auto-categorize helper
router.post('/categorize', mlController.categorize);
module.exports = router;
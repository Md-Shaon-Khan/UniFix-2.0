const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
// Optional: Add 'auth' middleware here if analytics should be private
// const auth = require('../middleware/auth'); 

router.get('/summary', analyticsController.summary);
router.get('/trends', analyticsController.trends);

module.exports = router;
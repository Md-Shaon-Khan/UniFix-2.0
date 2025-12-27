const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');

router.get('/', complaintController.list); // Public/Student list
router.post('/', auth, complaintController.create); // Submit
router.get('/:id', complaintController.get); // Details
router.post('/:id/vote', auth, complaintController.vote); // Upvote

// Authority Only: Update Status
router.put('/:id/status', auth, complaintController.updateStatus);

module.exports = router;
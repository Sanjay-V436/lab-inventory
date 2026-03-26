const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllRequests,
  getRequestById,
  createRequest,
  acceptRequest,
  declineRequest
} = require('../controllers/requestController');

// Public route — student form submission
router.post('/', upload.single('letter_proof'), createRequest);

// Protected routes — lab assistant dashboard
router.get('/',         verifyToken, getAllRequests);
router.get('/:id',      verifyToken, getRequestById);
router.patch('/:id/accept',  verifyToken, acceptRequest);
router.patch('/:id/decline', verifyToken, declineRequest);

module.exports = router;
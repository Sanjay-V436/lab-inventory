const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllReturns,
  getReturnById,
  submitReturn
} = require('../controllers/returnController');

router.get('/',             verifyToken, getAllReturns);
router.get('/:requestId',   verifyToken, getReturnById);
router.post('/:requestId',  verifyToken, submitReturn);

module.exports = router;
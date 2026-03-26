const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getAllHistory,
  getHistoryById
} = require('../controllers/historyController');

router.get('/',     verifyToken, getAllHistory);
router.get('/:id',  verifyToken, getHistoryById);

module.exports = router;
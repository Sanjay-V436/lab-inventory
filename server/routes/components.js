const express = require('express');
const router = express.Router();
const {
  getAllComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent
} = require('../controllers/componentController');
const verifyToken = require('../middleware/auth');
router.get('/:id',  getComponentById);
router.post('/',    createComponent);
router.put('/:id',  updateComponent);
router.delete('/:id', deleteComponent);
router.get('/', getAllComponents);
module.exports = router;
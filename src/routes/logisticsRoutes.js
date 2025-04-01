const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const { verifyToken } = require('../middleware/authMiddleware');

router.put('/update', verifyToken, logisticsController.updateDeliveryStatus);
router.get('/:id', verifyToken, logisticsController.getDeliveryStatus);

module.exports = router;

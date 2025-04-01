const express = require('express');
const router = express.Router();
const partnershipController = require('../controllers/partnershipController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/add', verifyToken, verifyAdmin, partnershipController.addPartnership);
router.get('/', verifyToken, verifyAdmin, partnershipController.getPartnerships);

module.exports = router;

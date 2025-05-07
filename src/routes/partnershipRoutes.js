const express = require('express');
const router = express.Router();

const {
  addPartnership,
  getAllPartnerships,
  getPendingPartnerships,
  updatePartnershipStatus,
  updatePartnershipInfo
} = require('../controllers/partnershipController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/add', addPartnership); 
router.get('/', verifyToken, verifyAdmin, getAllPartnerships);
router.get('/pending', verifyToken, verifyAdmin, getPendingPartnerships);
router.put('/:id/status', verifyToken, verifyAdmin, updatePartnershipStatus);
router.put('/:id', verifyToken, verifyAdmin, updatePartnershipInfo);

module.exports = router;

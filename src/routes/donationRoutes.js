const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/donate', verifyToken, donationController.createDonation);
router.get('/', donationController.getDonations);
router.get('/:id', donationController.getDonationById);

module.exports = router;

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/donate', donationController.createDonation);
router.get('/', donationController.getDonations);
router.get('/:id', donationController.getDonationById);

module.exports = router;

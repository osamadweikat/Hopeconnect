const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/add', verifyToken, reviewController.addReview);
router.get('/:id', reviewController.getReviews);

module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/profile', verifyToken, userController.updateUserProfile);
router.post('/verify-password-code', verifyToken, userController.verifyPasswordCode);


module.exports = router;

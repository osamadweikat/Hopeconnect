const express = require('express');
const router = express.Router();

const {
  getUnreadNotifications,
  markAsRead,
  sendNotification  
} = require('../controllers/notificationController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/send', verifyToken, sendNotification);
router.get('/unread', verifyToken, getUnreadNotifications);
router.post('/mark-read', verifyToken, markAsRead);

module.exports = router;

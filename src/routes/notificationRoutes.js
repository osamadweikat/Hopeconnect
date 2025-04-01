const express = require('express');
const { getUnreadNotifications, markAsRead } = require('../controllers/notificationController');
const router = express.Router();

router.get('/unread', getUnreadNotifications);
router.post('/mark-read', markAsRead);

module.exports = router;

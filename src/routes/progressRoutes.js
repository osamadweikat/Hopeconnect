const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');


router.post('/update', verifyToken, verifyAdmin, progressController.addOrphanProgressUpdate);
router.get('/updates/:id', progressController.getOrphanProgressUpdates);

module.exports = router;

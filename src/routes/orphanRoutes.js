const express = require('express');
const { createOrphanProfile } = require('../controllers/orphanController');
const router = express.Router();

router.post('/create', createOrphanProfile);

module.exports = router;

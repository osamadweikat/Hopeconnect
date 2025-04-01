const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); 
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware'); 

router.put('/:id/approve', verifyToken, verifyAdmin, adminController.approveUser);
router.put('/:id/reject', verifyToken, verifyAdmin, adminController.rejectUser);
router.delete('/users/:id', verifyToken, verifyAdmin, adminController.deleteUser); 
router.get('/users/:id', verifyToken, verifyAdmin, adminController.getUserById); 
router.get('/pending-registrations', verifyToken, verifyAdmin, adminController.getPendingRegistrations);
router.put('/orphanages/:id/verify', verifyToken, verifyAdmin, adminController.verifyOrphanage);

module.exports = router;

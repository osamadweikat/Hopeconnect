const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  upload,
  createOrphanProfile,
  getOrphansByOrphanage,
  getOrphanById,
  updateOrphan,
  deleteOrphan
} = require('../controllers/orphanController');

router.post('/create', verifyToken, upload.single('profile_image'), createOrphanProfile);
router.get('/by-orphanage/:orphanage_id', verifyToken, getOrphansByOrphanage);
router.get('/:id', verifyToken, getOrphanById);
router.put('/:id', verifyToken, upload.single('profile_image'), updateOrphan);
router.delete('/:id', verifyToken, deleteOrphan);

module.exports = router;

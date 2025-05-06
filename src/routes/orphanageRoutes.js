const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const orphanageController = require("../controllers/orphanageController");

router.post("/verify/:id", verifyToken, verifyAdmin, orphanageController.verifyOrphanage);
router.get("/", orphanageController.getAllOrphanages);
router.get("/:id", orphanageController.getOrphanageById);
router.post("/", verifyToken, orphanageController.createOrphanage);
router.put("/:id", verifyToken, verifyAdmin, orphanageController.updateOrphanage);
router.delete("/:id", verifyToken, verifyAdmin, orphanageController.deleteOrphanage);

module.exports = router;

const express = require("express");
const router = express.Router();
const orgController = require("../controllers/organizationController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { submitManagerFeedback } = require("../controllers/managerFeedbackController");
const { submitOrganizationFeedback } = require("../controllers/organizationFeedbackController");

router.post("/feedback/to-manager", verifyToken, submitManagerFeedback); 
router.post("/feedback/to-organization", verifyToken, submitOrganizationFeedback); 
router.get("/feedbacks", verifyToken, orgController.getFeedbacks);
router.post("/report", verifyToken, verifyAdmin, orgController.sendReportToOrganization);
router.post("/contribute", verifyToken, orgController.addContribution);
router.get("/contributions/:organization_id", verifyToken, orgController.getOrganizationContributions);
router.post("/withdraw", verifyToken, orgController.withdrawPartnership);
router.put("/withdraw/:id/approve", verifyToken, verifyAdmin, orgController.approveWithdrawalRequest);

module.exports = router;

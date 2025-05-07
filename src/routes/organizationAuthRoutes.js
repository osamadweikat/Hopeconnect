const express = require("express");
const router = express.Router();
const { loginOrganization } = require("../controllers/organizationAuthController");

router.post("/login", loginOrganization);

module.exports = router;

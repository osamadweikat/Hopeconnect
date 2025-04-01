const express = require("express");
const router = express.Router();
const { fetchHumanitarianData } = require("../controllers/externalApiController");

router.get("/humanitarian-data", fetchHumanitarianData);

module.exports = router;

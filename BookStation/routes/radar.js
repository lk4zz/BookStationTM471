const express = require("express");
const router = express.Router();
const radarController = require("../controllers/radarController");

// Open route for local testing / demos — do not expose publicly without auth + roles.
router.get("/:userId", radarController.getUserRadar);

module.exports = router;

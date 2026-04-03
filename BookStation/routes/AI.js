const AIController = require('../controllers/AIController');
const express = require('express');
const router = express.Router();

router.post('/prompt', AIController.promptAI)

module.exports = router;
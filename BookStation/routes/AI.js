const AIController = require('../controllers/AIController');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/prompt', verifyToken, AIController.promptAI)

module.exports = router;
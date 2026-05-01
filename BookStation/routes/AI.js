const AIController = require('../controllers/AIController/AIController');
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const checkAIAccess = require('../middlewares/checkAIAccess');



router.post('/prompt', verifyToken, checkAIAccess, AIController.promptAI)

module.exports = router;
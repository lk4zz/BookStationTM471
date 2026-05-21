const AIController = require('../controllers/AIController/AIController');
const express = require('express');
const router = express.Router();
const { verifyToken, checkIfBanned } = require('../middlewares/verifyToken');
const checkAIAccess = require('../middlewares/checkAIAccess');



router.post('/prompt', verifyToken, checkIfBanned, checkAIAccess, AIController.promptAI)

module.exports = router;
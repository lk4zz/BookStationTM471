const express = require('express');
const router = express.Router();
const { optionalAuthWithBanCheck } = require('../middlewares/verifyToken');
const searchController = require('../controllers/searchController');

router.get('/', ...optionalAuthWithBanCheck, searchController.getSearch);

module.exports = router;
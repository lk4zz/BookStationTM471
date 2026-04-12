const express = require('express');
const router = express.Router();
const { verifyTokenOptional } = require('../middlewares/verifyToken');
const searchController = require('../controllers/searchController');

router.get('/', verifyTokenOptional, searchController.getSearch);

module.exports = router;
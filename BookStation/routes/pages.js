const express = require('express');
const router = express.Router();
const { verifyToken, requireAuthor, optionalAuthWithBanCheck, checkIfBanned } = require('../middlewares/verifyToken');
const pageController = require('../controllers/pagecontroller');
const validatePage = require('../middlewares/validatePage.js');

router.get('/author/:chapterId', verifyToken, checkIfBanned, pageController.getPagesForAuthor);
router.put('/primary/:chapterId', ...requireAuthor, validatePage.validatePrimaryPageHtml, pageController.upsertPrimaryPage);

router.get('/:chapterId', ...optionalAuthWithBanCheck, pageController.getPagesByChapter);


module.exports = router;
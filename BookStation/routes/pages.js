const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenOptional } = require('../middlewares/verifyToken');
const pageController = require('../controllers/pagecontroller');
const validatePage = require('../middlewares/validatePage.js');

router.get('/author/:chapterId', verifyToken, pageController.getPagesForAuthor);
router.put('/primary/:chapterId', verifyToken, validatePage.validatePrimaryPageHtml, pageController.upsertPrimaryPage);

router.get('/:chapterId',verifyTokenOptional, pageController.getPagesByChapter);


// delete all three of those if they didnt come to use later!!!
router.delete('/:id', verifyToken, pageController.deletePage);

module.exports = router;
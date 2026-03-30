const express = require('express');
const router = express.Router();
const { verifyToken, verifyTokenOptional } = require('../middlewares/verifyToken');
const pageController = require('../controllers/pagecontroller');
const validatePage = require('../middlewares/validatePage.js');

router.get('/author/:chapterId', verifyToken, pageController.getPagesForAuthor);
router.put('/primary/:chapterId', verifyToken, validatePage.validatePrimaryPageHtml, pageController.upsertPrimaryPage);

router.get('/:chapterId',verifyTokenOptional, pageController.getPagesByChapter);

router.post('/:chapterId', verifyToken, validatePage, pageController.createPage);
router.put('/:chapterId/:id', verifyToken, validatePage, pageController.updatePage);
router.delete('/:id', verifyToken, pageController.deletePage);

module.exports = router;
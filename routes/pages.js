const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/verifyToken');
const pageController = require('../controllers/pagecontroller');
const validatePage = require('../middlewares/validatePage.js');

router.post('/:chapterId', verifyToken, validatePage, pageController.createPage);
router.put('/:chapterId/:id', verifyToken, validatePage, pageController.updatePage);
router.get('/:chapterId', pageController.getPagesByChapter);
router.delete('/:id', verifyToken, pageController.deletePage);



module.exports = router;
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const authController = require('../controllers/userController/authController'); 
const { validateSignup, validateLogin } = require('../middlewares/validateAuth');

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

router.get('/vip', verifyToken, (req, res) => {       
    res.status(200).json({message: `Welcome to the VIP area`, nameTag: req.user});  //this is test for jwt
});    

module.exports = router;
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const controller = require ('../controllers/authController');
const {validateSignup, validateLogin} = require('../middlewares/validateAuth');


router.post('/signup', validateSignup, controller.signup);

router.post('/login', validateLogin, controller.login);

router.get('/vip', verifyToken, (req, res) => {       //test route to verify token works
    res.status(200).json({message: `Welcome to the VIP area`, nameTag: req.user});
});    

module.exports = router;
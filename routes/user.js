const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');

const authCtr = require('../controller/authCtr');
const isAuth = require('../middleware/isAuth');
// const User = require('../models/User');
const router = express.Router();

router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    check('password').isLength({
        min: 5
    }),
    check('name').trim().not().isEmpty()
], authCtr.signup);

router.post('/login', authCtr.login);

router.patch('/EditProfile',isAuth ,authCtr.EditProfile);

router.post('/AddCart/:productId',isAuth ,authCtr.AddCart);

router.patch('/EditCart/:cartId',isAuth , authCtr.EditCart);

router.delete('/DelectCart/:cartId',isAuth , authCtr.DelectCart);

router.patch('/resetPwd',isAuth ,authCtr.resetPwd);

router.patch('/forgetPwd',isAuth ,authCtr.forgetPwd);


module.exports = router;
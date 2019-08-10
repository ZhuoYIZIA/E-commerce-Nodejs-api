const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');

const productCtr = require('../controller/productCtr');
// const isAuth = require('../middleware/isAuth');
// const Product = require('../models/Product');
const router = express.Router();

router.get('/getProducts', productCtr.getProducts);

router.get('/getProduct/:productId', productCtr.getProduct);



module.exports = router;
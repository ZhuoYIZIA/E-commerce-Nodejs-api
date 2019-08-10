const express = require('express');
const adminCtr = require('../controller/adminCtr');
const {
    check,
    validationResult
} = require('express-validator');
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/createProduct',isAuth ,upload.single('image'), adminCtr.createProduct);

router.patch('/updateProduct/:productId',isAuth,upload.single('image'),  adminCtr.updateProduct);

router.delete('/delectProduct/:productId',isAuth ,adminCtr.delectProduct);

module.exports = router;
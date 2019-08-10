const express = require('express');
const isAuth = require('../middleware/isAuth');
const orderCtr = require('../controller/orderCtr');
const router = express.Router();

router.post('/create',isAuth ,orderCtr.create);

module.exports = router;
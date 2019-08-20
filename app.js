const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const adminRouter = require('./routes/admin');
const orderRouter = require('./routes/order');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.ACA_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', process.env.ACA_METHODS);
    res.setHeader('Access-Control-Allow-Headers', process.env.ACA_HEADERS);
    next();
});


// ===============routers===============

app.use(userRouter);
app.use(productRouter);
app.use('/admin', adminRouter);
app.use('/order', orderRouter);

// ===============routers===============

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

dotenv.config();
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('start run node');
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });
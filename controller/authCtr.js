const {
    check,
    validationResult
} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const isEmail = await User.findOne({
            email: email
        });
        if (isEmail) {
            const error = new Error('this email is already exit.');
            error.statusCode = 422;
            throw error;
        }
        const hashPwd = await bcrypt.hash(password, 12);
        const user = new User({
            name: name,
            email: email,
            password: hashPwd
        });
        const result = await user.save();
        res.status(200).json({
            message: 'Created',
            userId: result._id
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        const isPwd = await bcrypt.compare(password, user.password);
        if (!isPwd) {
            const error = new Error('password mistake');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString(),
            name: user.name
        }, process.env.API_KEY, {
            expiresIn: '1h'
        });
        res.status(200).json({
            token: token,
            userId: user._id.toString(),
            name: user.name
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.EditProfile = async (req, res, next) => {
    const userId = req.userId;
    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    try {
        if (!userId) {
            const error = new Error('Not authorization.');
            error.statusCode = 401;
            throw error;
        }
        const user = await User.findOne({
            _id: userId
        });
        user.name = name;
        user.address = address;
        user.phone = phone;
        const result = await user.save();
        res.status(200).json({
            message: 'Updated successfully',
            data: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.AddCart = async (req, res, next) => {
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    try {
        const product = Product.findOne({
            _id: productId
        });
        if (!product) {
            const error = new Error('Can not found product');
            error.statusCode = 404;
            throw error;
        }
        const user = await User.findOne({
            _id: req.userId
        });
        const isProduct = user.cart.filter(function (item) {
            return item.productId.toString() === productId.toString();
        });
        if (isProduct.length > 0) {
            const error = new Error('This product is already exist');
            error.statusCode = 500;
            throw error;
        }
        user.cart.push({
            productId: productId,
            quantity: quantity
        });
        const result = await user.save();
        res.status(200).json({
            message: 'Add successfully',
            data: result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.EditCart = async (req, res, next) => {
    const cartId = req.params.cartId;
    const quantity = req.body.quantity;
    try {
        const user = await User.findOne({
            _id: req.userId
        });
        const newCart = user.cart.map(function (item) {
            if (item._id.toString() === cartId.toString()) {
                item.quantity = quantity;
            }
            return item;
        });
        await user.save();
        res.status(200).json({
            message: 'Edit successfully',
            data: newCart
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.DelectCart = async (req, res, next) => {
    const cartId = req.params.cartId;
    try {
        const user = await User.findOne({
            _id: req.userId
        });
        const newCart = user.cart.filter(function (item) {
            return item._id.toString() !== cartId.toString();
        });
        user.cart = newCart;
        await user.save();
        res.status(200).json({
            message: 'Delete successfully',
            data: newCart
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.resetPwd = async (req, res, next) => {
    const oldpwd = req.body.oldpwd;
    const newPwd = req.body.newPwd;
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        const isOldPwd = await bcrypt.compare(oldpwd, user.password);
        if (!isOldPwd) {
            const error = new Error('old password wroung.');
            error.statusCode = 422;
            throw error;
        }
        if (oldpwd === newPwd) {
            const error = new Error('New and old password are same.');
            error.statusCode = 422;
            throw error;
        }
        const hashPwd = await bcrypt.hash(newPwd, 12);
        user.password = hashPwd;
        await user.save();
        res.status(200).json({
            message: 'Update successfully'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.forgetPwd = async (req, res, next) => {

};
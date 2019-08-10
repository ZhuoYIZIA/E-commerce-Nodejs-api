const Product = require('../models/Product');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const fileHelp = require('../util/file');

exports.createProduct = async (req, res, next) => {
    if (!req.file) {
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.file.path;
    const description = req.body.description;
    const creator = req.userId;
    const product = new Product({
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        creator: creator
    });
    try {
        await product.save();
        const user = await User.findOne({
            _id: creator
        });
        user.products.push(product);
        await user.save();
        res.status(200).json({
            message: 'created successfully!',
            product: product,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.updateProduct = async (req, res, next) => {
    const productId = req.params.productId;
};

exports.delectProduct = async (req, res, next) => {
    const productId = req.params.productId;

};

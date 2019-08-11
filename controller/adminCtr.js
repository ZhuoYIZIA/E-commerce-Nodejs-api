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
    const userId = req.userId;
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.file.path;
    const description = req.body.description;
    let oldimageUrl
    try {
        const product = await Product.findOne({
            _id: productId
        });
        if (!product) {
            const error = new Error('Can not found this product.');
            error.statusCode = 404;
            throw error;
        }
        if (product.creator.toString() !== userId.toString()) {
            const error = new Error('Not authorization.');
            error.statusCode = 401;
            throw error;
        }
        product.name = name;
        product.price = price;
        oldimageUrl = product.imageUrl;
        product.description = description;
        if (oldimageUrl !== imageUrl) {
            product.imageUrl = imageUrl;
            fileHelp.deleteFile(oldimageUrl);
        }
        const result = await product.save();
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

exports.delectProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.userId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            const error = new Error('Cant found this product.');
            error.statusCode = 404;
            throw error;
        }
        if (product.creator.toString() !== userId.toString()) {
            const error = new Error('Not authorization.');
            error.statusCode = 401;
            throw error;
        }
        fileHelp.deleteFile(product.imageUrl);
        await Product.deleteOne({
            _id: productId
        });
        const user = await User.findById(userId);
        user.products.pull(productId);
        await user.save();

        res.status(200).json({
            message: 'Delete successfully',
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Product.find().countDocuments;
        const products = await Product.find().populate('creator')
            .sort({
                createdAt: -1
            }).skip((page - 1) * perPage).limit(perPage);

        res.status(200).json({
            message: 'Fetched successfully.',
            result: products,
            totalItems: totalItems
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getProduct = async (req, res, next) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findOne({
            _id: productId
        });
        if (!product) {
            const error = new Error('cant find product.');
            error.statusCode = 404;
            throw error;
        }
        res.status(201).json({
            message: 'Fetched successfully.',
            result: product,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


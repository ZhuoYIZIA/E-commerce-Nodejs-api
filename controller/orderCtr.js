const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Invoice = require('../models/Invoice');

exports.getOrders = async (req, res, next) => {
    const userId = req.userId;

    try {
        const orderList = await Order.find({
            'user.userId': userId
        }).populate('products.productId', ['name', 'price', 'imageUrl', 'description']);

        res.status(200).json({
            message: 'Fetch successfully',
            data: orderList,
            totalPrice: totalPrice
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.create = async (req, res, next) => {
    const userId = req.userId;
    let totalPrice = 0;
    let productList;
    const token = req.body.stripeToken;
    try {
        const user = await User.findById(userId).populate('cart.productId');
        if (user.cart.length === 0) {
            const error = new Error('Have no product in cart.');
            error.statusCode = 500;
            throw error;
        }
        productList = user.cart.map(function (item) {
            totalPrice += item.quantity * item.productId.price;
            item = {
                productId: item.productId._id,
                quantity: item.quantity
            }
            return item;
        });

        const order = new Order({
            products: productList,
            user: {
                email: user.email,
                userId: user._id
            },
            totalPrice: totalPrice
        });

        const charges = await stripe.charges.create({
            amount: totalPrice,
            currency: 'TWD',
            description: 'demo',
            source: token,
            metadata: {
                'order_id': order._id.toString()
            }
        });
        const invoicesData = await stripe.invoiceItems.create({
            customer = charges.customer,
            amount: totalPrice,
            currency: 'TWD',
            description: 'Demo'
        });

        const invoiceItem = new Invoice({
            items: invoicesData
        });

        order.invoiceId = invoiceItem._id;

        user.cart = [];
        await invoiceItem.save();
        await order.save();
        await user.save();

        res.status(200).json({
            message: 'successfully',
            charges: charges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};
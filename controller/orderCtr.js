const User = require('../models/User');
const Product = require('../models/Product');

exports.create = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await User.findOne({
            _id: userId
        });
        if (user.cart.length === 0) {
            const error = new Error('Have no product in cart.');
            error.statusCode = 500;
            throw error;
        }
        const orderList = [...user.cart];
        const order = new Order(orderList);
        // await order.save();

        res.status(200).json({
            message: 'successfully',
            data: order
        });
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};
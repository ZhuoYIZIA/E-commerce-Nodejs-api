const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [{
        productId: {
            type: String,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        email: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    invoiceId: {
        type: String,
        required: true,
        ref: 'Invoice'
    }
});

module.exports = mongoose.model('Order', orderSchema);
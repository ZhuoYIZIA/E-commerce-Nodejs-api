const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    items: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
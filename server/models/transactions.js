const mongoose = require('mongoose');
const Joi = require('joi');
const TransactionSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    ticker: {
        type: String,
        require: true,
        uppercase: true
    },
    dateTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    strategy : {
        type: String,
        required: true
    },
    stockPrice: {
        type: Number,
        min: 0,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['buy', 'sell', 'short', 'cover']
    },
    volume: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true
    }
});

TransactionSchema.statics.fillable = ['account', 'ticker', 'dateTime', 'strategy', 'stockPrice', 'type', 'volume', 'total'];
const Transaction = mongoose.model('Transaction', TransactionSchema);

function validateTransaction(transaction) {
    const schema = {
        ticker: Joi.string().required(),
        account: Joi.objectId().required(),
        strategy: Joi.string().required(),
        stockPrice: Joi.number().min(0).required(),
        type: Joi.string().required(),
        volume: Joi.number().min(0).required(),
        total: Joi.number().required()
    }
    return Joi.validate(transaction, schema);
}
module.exports.Transaction = Transaction;
module.exports.validate = validateTransaction;
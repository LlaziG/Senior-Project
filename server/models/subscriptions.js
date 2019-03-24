const mongoose = require('mongoose');
const Joi = require('joi');
const subscriptionSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        maxlength: 10
    },
    candleSize: {
        type: String,
        required: true,
        maxlength: 5,
        enum: ['0', '1m', '2m', '5m', '15m', '30m', '1h']
    },
    profit: {
        type: Number,
        default: 0
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    strategy: {
        type: String,
        required: true
    }
});

subscriptionSchema.statics.fillable = ['ticker', 'candleSize', 'account', 'profit', 'strategy'];
const Subscription = mongoose.model('Subscription', subscriptionSchema);

function validateSubscription(subscription) {
    const schema = {
        ticker: Joi.string().max(10).required(),
        candleSize: Joi.string().max(5).required(),
        profit: Joi.number(),
        account: Joi.objectId().required(),
        strategy: Joi.string().required()
    }
    return Joi.validate(subscription, schema);
}

module.exports.Subscription = Subscription;
module.exports.validate = validateSubscription;
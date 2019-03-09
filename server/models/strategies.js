const mongoose = require('mongoose');
const Joi = require('joi');
const StrategySchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    strategy: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        require: true,
        uppercase: true
    },
    date: {
        type: Date,
        require: true
    },
    profit: {
        type: Number,
        default: 0
    }
});

StrategySchema.statics.fillable = ['account', 'strategy', 'ticker', 'date', 'profit'];
const Strategy = mongoose.model('Strategy', StrategySchema);

function validateStrategy(strategy) {
    const schema = {
        account: Joi.objectId().required(),
        ticker: Joi.string().required(),
        strategy: Joi.string().required(),
        date: Joi.date().required(),
        number: Joi.number()
    }
    return Joi.validate(strategy, schema);
}
module.exports.Strategy = Strategy;
module.exports.validate = validateStrategy;
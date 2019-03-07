const mongoose = require('mongoose');
const Joi = require('joi');
const portfolioSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true,
        maxlength: 10
    },
    type : {
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
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    }
});

portfolioSchema.statics.fillable = ['ticker', 'type', 'volume', 'total', 'account'];
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

function validatePortfolio(portfolio) {
    const schema = {
        ticker: Joi.string().max(10).required(),
        type: Joi.string().required(),
        volume : Joi.number().min(0).required(),
        total : Joi.number().required(),
        account: Joi.objectId().required()
    }
    return Joi.validate(portfolio, schema);
}

module.exports.Portfolio = Portfolio;
module.exports.validate = validatePortfolio;
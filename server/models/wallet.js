const mongoose = require('mongoose');
const Joi = require('joi');
const walletSchema = new mongoose.Schema({
    invested: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    available: {
        type: Number,
        default: 0,
        required: true
    },
    provisions: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
});
walletSchema.statics.fillable = ['invested', 'available', 'provisions', 'account'];
const Wallet = mongoose.model('Wallet', walletSchema);


function validateWallett(wallet) {
    const schema = {
        invested: Joi.number().required(),
        available: Joi.number().required(),
        provisions: Joi.number().min(0).required(),
        account: Joi.objectId()
    }
    return Joi.validate(wallet, schema);
}
module.exports.Wallet = Wallet;
module.exports.validate = validateWallett;
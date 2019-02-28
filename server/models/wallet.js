const mongoose = require('mongoose');
const Joi = require('joi');
const walletSchema = new mongoose.Schema({
    invested : {
        type : Number,
        default : 0,
        min: 0,
        required : true
    },
    total : {
        type : Number,
        default : 0,
        required : true
    },
    available:{
        type : Number,
        default : 0,
        required : true
    }
});
walletSchema.statics.fillable = ['invested','total','available'];
const Wallet = mongoose.model('Wallet', walletSchema);


function validateWallett(wallet){
    const schema = {
        invested : Joi.number().required(),
        total : Joi.number().required(),
        available : Joi.number().required()
    }
    return Joi.validate(wallet, schema);
}
module.exports.Wallet = Wallet;
module.exports.validate = validateWallett;
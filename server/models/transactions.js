const mongoose = require('mongoose');
const Joi = require('joi');
const TransactionSchema = new mongoose.Schema({
    account : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Account'
    },
    ticker : {
        type : String,
        require : true,
        uppercase : true
    },
    dateTime : {
        type : Date,
        required : true,
        default : Date.now
    },
    stockPrice : {
        type : Number,
        min : 0,
        required : true
    },
    type : {
        type : String,
        required : true,
        enum : ['buy', 'sell', 'short', 'cover']
    },
    volume : {
        type : Number,
        required : true,
        min : 0
    }
});

TransactionSchema.statics.fillable = ['account','ticker','dateTime','stockPrice', 'type', 'volume'];
const Transaction = mongoose.model('Transaction', TransactionSchema);

function validateTransaction(transaction){
    const schema = {
        account : Joi.objectId().required(),
        ticked : Joi.string().required(),
        dateTime : Joi.date().required(),
        stockPrice : Joi.number().min(0).required(),
        type : Joi.string().required(),
        volume : Joi.number().min(0).required()  
    }
    return Joi.validate(transaction, schema);
}
module.exports.Transaction = Transaction;
module.exports.validate = validateTransaction;
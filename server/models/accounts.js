const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const accountSchema = new mongoose.Schema({
    name : {
        type : String,
        maxlength : 75
    },
    email : {
        type : String,
        required : true,
        unique : true,
        maxlength : 255
    },
    password : {
        type : String,
        min : 0,
        required : true,
        maxlength : 2048
    },
    wallet : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Wallet'
    }
});

accountSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id : this._id}, config.get('jwtPrivateKey'));
    return token;
}
accountSchema.statics.fillable = ['name','email','password','wallet'];

const Account = mongoose.model('Account', accountSchema);

function validateAccount(account){
    const schema = {
        name : Joi.string().max(75).required(),
        email : Joi.string().max(255).required().email(),
        password : Joi.string().max(2048).required(),
        wallet : Joi.objectId().required()
    }
    return Joi.validate(account, schema);
}
function validateAuth(account){
    const schema = {
        email : Joi.string().max(255).required().email(),
        password : Joi.string().max(2048).required()
    }
    return Joi.validate(account, schema);
}
module.exports.Account = Account;
module.exports.validate = validateAccount;
module.exports.validateAuth = validateAuth;
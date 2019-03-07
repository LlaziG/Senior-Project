const express = require('express');
const router = express.Router();

const _ = require("lodash");

const { Transaction, validate } = require('../models/transactions');
const { Portfolio } = require('../models/portfolios');
const { Subscription } = require('../models/subscriptions');
const { auth, asyncEH } = require('../middleware/index');
const { updatePortfolio, updateSubscription, updateWallet } = require('../helpers/index');

router.post('/', asyncEH(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let portfolioObj = await updatePortfolio(_.pick(req.body, Portfolio.fillable));
    if (!_.isUndefined(portfolioObj.closed)) {
        await updateSubscription(_.extend(_.pick(req.body, Subscription.fillable), portfolioObj));
        await updateWallet({
            account: req.body.account,
            available: req.body.total,
            type: req.body.type,
            previous : portfolioObj.previous
        });
    }
    else {
        await updateWallet({
            account: req.body.account,
            available: req.body.total,
            type: req.body.type
        });
    }
    
    let transaction = new Transaction(req.body);
    transaction = await transaction.save();
    res.send(transaction);
}));

router.get('/', auth, asyncEH(async (req, res) => {
    const transactions = await Transaction.find().sort('-dateTime');
    res.send(transactions);
}));

router.get('/me', auth, asyncEH(async (req, res) => {
    const transactions = await Transaction.find({
        account: req.user._id
    }).sort('-dateTime');
    res.send(transactions);
}));

router.get('/ticker/:ticker', asyncEH(async (req, res) => {
    const transactions = await Transaction.find({
        account: req.user._id,
        ticker: req.params.ticker
    }).sort('-dateTime');
    let quantity = 0;
    let totalPrice = 0;
    for (transaction of transactions) {
        if (["short", "cover"].indexOf(transaction.type) != -1) break;
        quantity += transaction.type == "buy" ? + transaction.volume : - transaction.volume;
        totalPrice += transaction.stockPrice
    }
    const weightedPrice = quantity == 0 ? 0 : totalPrice / quantity;
    res.send({
        ticker: req.params.ticker,
        quantity: quantity,
        weightedPrice: weightedPrice
    });
}));

module.exports = router;
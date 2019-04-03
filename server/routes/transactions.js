const express = require('express');
const router = express.Router();

const _ = require("lodash");

const { Transaction, validate } = require('../models/transactions');
const { Portfolio } = require('../models/portfolios');
const { Subscription } = require('../models/subscriptions');
const { auth, asyncEH } = require('../middleware/index');
const { updatePortfolio, updateSubscription, updateWallet, updateStrategy } = require('../helpers/index');

let transactionsCache = new Array();
let transactionOperating = false;
function wrapFn(fn, context, params) {
    return function () {
        fn.apply(context, params);
    };
}

router.post('/', auth, asyncEH(async (req, res) => {
    if (_.isUndefined(req.body.account)) req.body.account = req.user._id;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const x = wrapFn(operations, this, [req.body]);
    transactionsCache.push(x);

    if (transactionsCache.length != 0 && !transactionOperating) (transactionsCache.shift())();
    async function operations(passedObject) {
        transactionOperating = true;
        let portfolioObj = await updatePortfolio(_.pick(passedObject, Portfolio.fillable));
        await updateStrategy(portfolioObj);
        if (!_.isUndefined(portfolioObj.closed)) {
            Promise.all([await updateSubscription(_.extend(_.pick(passedObject, Subscription.fillable), portfolioObj)),
            await updateWallet({
                account: passedObject.account,
                available: passedObject.total,
                type: passedObject.type,
                previous: portfolioObj.previous
            })])
                .then(() => {
                    transactionsCache.length != 0 ? (transactionsCache.shift())() : transactionOperating = false;
                })
                .catch(() => res.status(500).send(new Error.details[0].message));
        }
        else {
            Promise.all([await updateWallet({
                account: passedObject.account,
                available: passedObject.total,
                type: passedObject.type
            })])
                .then(() => {
                    transactionsCache.length != 0 ? (transactionsCache.shift())() : transactionOperating = false;
                })
                .catch(() => res.status(500).send(new Error.details[0].message));
        }
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
const _ = require("lodash");
const config = require('config');

const express = require('express');
const router = express.Router();

const { Subscription, validate } = require('../models/subscriptions');
const { auth, asyncEH } = require('../middleware/index');
ObjectId = require('mongodb').ObjectID;

router.post('/', auth, asyncEH(async (req, res) => {
    let subObj = req.body;
    subObj.account = req.user._id;
    tradingStragestrategies = _.split(config.get('tradingStrategies'), ',');
    subObj.strategy = tradingStragestrategies[_.random(0, tradingStragestrategies.length - 1)];

    const { error } = validate(subObj);
    if (error) return res.status(400).send(error.details[0].message);

    let subscription = await Subscription.findOne({
        account: req.user._id,
        ticker: req.body.ticker
    });
    if (subscription) {
        subObj.profit = 0;
        subObj.strategy = subscription.strategy;
        _.extend(subscription, subObj);
        const { error } = validate(_.pick(subObj, Subscription.fillable));
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        subscription.save();
        res.send(subscription);
    }
    else {
        subscription = new Subscription(subObj);
        subscription = await subscription.save();
        res.send(subscription);
    }
}));
router.put('/:id', asyncEH(async (req, res) => {
    if(!ObjectId.isValid(req.params.id)) return res.status(400).send({});
    const subscription = await Subscription.findOne({ _id: req.params.id });
    if (!subscription) return res.status(400).send({});
    _.extend(subscription, req.body);
    subscription.save();
    return res.status(200).send(subscription);
}));

router.delete("/ticker/:ticker", auth, asyncEH(async (req, res) => {
    const subscription = await Subscription.findOne({
        account: req.user._id,
        ticker: req.params.ticker
    });
    if (!subscription) return res.status(400).send();
    subscription.remove();
    res.send(subscription);
}));


router.get("/ticker/:ticker", auth, asyncEH(async (req, res) => {
    const subscription = await Subscription.findOne({
        account: req.user._id,
        ticker: req.params.ticker
    });
    if (!subscription) return res.send({ 'candleSize': '0' });
    res.send(subscription);
}));

router.get("/me", auth, asyncEH(async (req, res) => {
    const subscriptions = await Subscription.find({ account: req.user._id }).sort('ticker');

    if (!subscriptions) return res.send({});
    res.send(subscriptions);
}));

router.get("/unique", asyncEH(async (req, res) => {
    const subscriptions = await Subscription.find().distinct('ticker');
    if (!subscriptions) return res.send({});
    res.send(subscriptions);
}));

router.get("/", asyncEH(async (req, res) => {
    const subscriptions = await Subscription.find().sort('account');
    if (!subscriptions) return res.send({});
    res.send(subscriptions);
}));
module.exports = router;
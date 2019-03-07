const _ = require("lodash");

const { Subscription } = require('../models/subscriptions');

async function updateSubscription(obj) {
    console.log(obj);
    const subscription = await Subscription.findOne({ account: obj.account, ticker: obj.ticker });

    if (!subscription) return {};
    _.extend(subscription, { profit: subscription.profit + obj.profit })
    subscription.save();
    return subscription;
}

module.exports = updateSubscription;
const _ = require("lodash");

const { Strategy, validate } = require('../models/strategies');

async function updateStrategy(obj) {
    var start = new Date();
    var end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    const strategy = await Strategy.find({ account: obj.account, ticker: obj.ticker, strategy: obj.strategy }).sort('-date').limit(1);
    if (strategy.length != 0 && !_.isUndefined(obj.profit)) {
        _.extend(strategy[0], { profit: strategy[0].profit + obj.profit });
        
        strategy[0].save();
        return strategy[0];
    }
    else {
        let strategyObj = _.pick(_.extend(obj, { date: new Date() }), Strategy.fillable);
        strategyObj.account = String(obj.account);
        const { error } = validate(strategyObj);
        if (error) {
            console.log(error);
            return new Error(error.details[0].message);
        }
        let strategy = new Strategy(strategyObj);
        strategy = await strategy.save();
        return strategy;
    }
}

module.exports = updateStrategy;



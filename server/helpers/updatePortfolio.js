const _ = require("lodash");

const { Portfolio, validate } = require('../models/portfolios');

async function updatePortfolio(obj) {
    const { error } = validate(obj);
    if (error) return new Error(error.details[0].message);

    let portfolio = await Portfolio.findOne({
        account: obj.account,
        ticker: obj.ticker
    });

    if (portfolio) {
        if (portfolio.type == obj.type) {
            let portfObj = obj;
            portfObj.volume += portfolio.volume;
            portfObj.total += portfolio.total;

            const { error } = validate(_.pick(portfObj, Portfolio.fillable));
            if (error) {
                if (error) return new Error(error.details[0].message);
            }

            _.extend(portfolio, portfObj);

            portfolio.save();
            return portfolio;
        }
        else {
            portfolio.remove();
            return _.extend(portfolio, { closed: true, profit: obj.total + portfolio.total, previous: portfolio.total, strategy: portfolio.strategy });
        }
    }
    else {
        portfolio = new Portfolio(obj);
        portfolio = await portfolio.save();
        return portfolio;
    }
}

module.exports = updatePortfolio;
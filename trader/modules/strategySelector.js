
const server = require('../communcation/index');
const helper = require('../helpers/index');
const strategy = require('../strategies/index');
const strategies = Object.keys(strategy);

//Modules
const stopLoss = require('./stopLoss');
const executor = require('./executor');
module.exports = function strategySelector() {
    Promise.all([
        // Get subscriptions - what to be traded, portfolios - open positions, wallets - available cash
        server.subscription.getSubscriptions(),
        server.portfolio.getPortfolios(),
        server.wallet.getWallets()
    ]).then(async values => {
        //Re-organize results by Accounts for faster and easier indexing
        let subscriptions = helper.splitObjByAccounts(values[0]);
        let portfolios = helper.splitObjByAccounts(values[1]);
        let wallets = helper.splitObjByAccounts(values[2]);

        //For each Account
        await Promise.all(Object.keys(subscriptions).map(async (key) => {
            //For each of its subscriptions
            await Promise.all(subscriptions[key].map(async (subscription) => {
                let skipFlag = false;
                let range = "7d";
                if (subscription.candleSize == "0") skipFlag = true;
                else if (subscription.candleSize != "1m") range = "14d";

                if (!skipFlag) {
                    //Get Yahoo Data
                    traderObj = Promise.all([server.yahoo.getChart(subscription.ticker, subscription.candleSize, range)])
                        .then(async (values) => {
                            const ohlcv = helper.formatTOHLCV(JSON.parse(values).chart.result[0]);
                            //Calculate Strategy Results
                            let strategyResults = new Object();

                            for (strategyName of strategies) strategyResults[strategyName] = strategy[strategyName].getQuote(ohlcv, "all");
                            const selectedStrategy = compareProfit(ohlcv, strategyResults);
                            console.log(subscription.ticker, selectedStrategy);
                            return await server.subscription.updateStrategy(subscription._id, { strategy: selectedStrategy.toUpperCase() });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    //Update Subscription with Strategy
                    return traderObj;
                }
            })).catch(err => {
                console.log(err);
            });
        })).then(() => {
            console.log("-------------- FINISHED STRATEGY SELECTION --------------");
        }).catch(err => {
            console.log(err);
        });
    })
}
function compareProfit(ohlcv, results) {
    let transactions = new Object();
    let profits = new Object();
    let maxProfitStrategy;
    for (strategyName of strategies) {
        transactions[strategyName] = new Array();
        profits[strategyName] = 0;
        maxProfitStrategy = strategyName;

        for (candle of results[strategyName]) {
            let last_transaction = transactions[strategyName].length != 0 ? transactions[strategyName][transactions[strategyName].length - 1] : 0;
            if (last_transaction && transactions[strategyName].length % 2 == 1) {
                for (let i = last_transaction.candleNo + 1; i < ohlcv.close.length; i++) {
                    if (candle.order != "HOLD") break;
                    else if (last_transaction.type == "BUY") {
                        if (((last_transaction.price * -1 - ohlcv.low[i]) / (last_transaction.price * -1)) >= 0.02) {
                            transactions[strategyName].push({ type: "SELL", price: ohlcv.low[i], candleNo: i });
                            break;
                        }
                    }
                    else if (last_transaction.type == "SELL") {
                        if (((last_transaction.price - ohlcv.high[i]) / (last_transaction.price)) <= -0.02) {
                            transactions[strategyName].push({ type: "BUY", price: ohlcv.high[i] * -1, candleNo: i });
                            break;
                        }
                    }
                }
            }
            if (candle.order != "HOLD") {
                let multiplier = candle.order == "BUY" ? -1 : 1;
                if (last_transaction) {
                    if (last_transaction.type != candle.order) {
                        transactions[strategyName].push({ type: candle.order, price: ohlcv.close[candle.candleNo] * multiplier, candleNo: candle.candleNo });
                    }
                }
                else {
                    transactions[strategyName].push({ type: candle.order, price: ohlcv.close[candle.candleNo] * multiplier, candleNo: candle.candleNo });
                }
            }
        }
        for (i in transactions[strategyName]) {
            if (transactions[strategyName].length % 2 == 1 && i == transactions[strategyName].length - 1) break;
            else profits[strategyName] += transactions[strategyName][i].price;
        }
    }
    for (key of Object.keys(profits)) {
        if (profits[maxProfitStrategy] < profits[key]) maxProfitStrategy = key;
    }
    return maxProfitStrategy;
}
const server = require('../communcation/index');
const helper = require('../helpers/index');
const strategy = require('../strategies/index');

//Modules
const stopLoss = require('./stopLoss');
const executor = require('./executor');
module.exports = function trader() {
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
            console.log("HANDLING ACCOUNT: ", key);
            //For each of its subscriptions
            await Promise.all(subscriptions[key].map(async (subscription) => {
                let skipFlag = false;
                let range = "7d";

                if (subscription.candleSize == "2m" || subscription.candleSize == "5m" || subscription.candleSize == "15m") range = "60d";
                else if (subscription.candleSize == "30m" || subscription.candleSize == "1h") range = "730d";
                else if (subscription.candleSize == "0") skipFlag = true;

                if (!skipFlag) {
                    //Get Yahoo Data
                    traderObj = Promise.all([server.yahoo.getChart(subscription.ticker, subscription.candleSize, range)])
                        .then(async (values) => {
                            const ohlcv = helper.formatTOHLCV(JSON.parse(values).chart.result[0]);
                            //Calculate Corresponding Strategy
                            const strategyResults = strategy[subscription.strategy.toLowerCase()].getQuote(ohlcv, "now");
                            //Risk Assertion module
                            //Execute Trade
                            return await executor(server, strategy, key, subscriptions, subscription, portfolios, wallets, strategyResults);

                        })
                        .catch(err => {
                            console.log(err, subscription.ticker);
                        });
                    return traderObj;
                }
            }))
                .then(async () => {
                    //Transactions for current account are now complete - handle stopLoss
                    console.log("STOP LOSS ACCOUNT: ", key);
                    if (portfolios[key]) await stopLoss(server, portfolios[key]);
                }).catch(err => {
                    console.log(err);
                });
        }))
            .then(() => {
                console.log("--------------BATCH COMPLETE - WAITING: 20s--------------");
            }).catch(err => {
                console.log(err);
            });
    })
}
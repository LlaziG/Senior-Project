module.exports = function (server, helper, strategy, apiPath) {
    let subscriptions = new Object();
    let portfolios = new Object();
    let wallets = new Object();

    Promise.all([
        // Get subscriptions - what to be traded, portfolios - open positions, wallets - available cash
        server.subscription.getSubscriptions(apiPath),
        server.portfolio.getPortfolios(apiPath),
        server.wallet.getWallets(apiPath)
    ]).then(values => {
        //Re-organize results by Accounts for faster and easier indexing
        helper.splitObjByAccounts(subscriptions, values[0]);
        helper.splitObjByAccounts(portfolios, values[1]);
        helper.splitObjByAccounts(wallets, values[2]);

        //For each Account
        Object.keys(subscriptions).forEach(key => {
            //For each of its subscriptions
            subscriptions[key].forEach(subscription => {
                let skipFlag = false;
                let range = "7d";
                if (subscription.candleSize == "2m" || subscription.candleSize == "5m" || subscription.candleSize == "15m") range = "60d";
                else if (subscription.candleSize == "30m" || subscription.candleSize == "1h") range = "730d";
                else if (subscription.candleSize == "0") skipFlag = true;

                if (!skipFlag) {
                    //Get Yahoo Data
                    Promise.all([server.yahoo.getChart(apiPath, subscription.ticker, subscription.candleSize, range)])
                        .then(async (values) => {
                            //Calculate Corresponding Strategy
                            let transactionData = new Object();
                            const ohlcv = helper.formatTOHLCV(JSON.parse(values).chart.result[0]);
                            const results = strategy.macd_stoch.getQuote(ohlcv, "now");
                            if (results[0].order == "HOLD") {
                                //Continue to next
                                console.log("SKIPPED: ", subscription.ticker, " : ", subscription.candleSize);
                            }
                            else {
                                //Order is BUY or SELL
                                //Check in Portfolio if a position is already open
                                let isOpen = false;
                                let transactionData = new Object();
                                if (typeof (portfolios[key]) != typeof (undefined)) {
                                    portfolios[key].forEach(async (position) => {
                                        if (position.ticker == subscription.ticker) {
                                            //Position is already opened
                                            isOpen = true;
                                            if ((position.type == "short" && results[0].order == "BUY") || (position.type == "buy" && results[0].order == "SELL")) {
                                                const multiplier = results[0].order == "BUY" ? -1 : 1;
                                                transactionData.ticker = subscription.ticker;
                                                transactionData.type = results[0].order == "BUY" ? "cover" : "sell";
                                                transactionData.stockPrice = JSON.parse(await server.yahoo.getQuote(apiPath, subscription.ticker))[subscription.ticker];
                                                transactionData.volume = position.volume;
                                                transactionData.strategy = subscription.strategy;
                                                transactionData.total = transactionData.stockPrice * transactionData.volume * multiplier;
                                                transactionData.account = key;
                                                console.log("EXECUTED: ", subscription.ticker, " : ", subscription.candleSize, transactionData);
                                                server.transaction.postTransaction(apiPath, transactionData);
                                            }
                                        }
                                    });
                                }
                                if (!isOpen) {
                                    //Not opened
                                    let openPositions = 0;
                                    const multiplier = results[0].order == "BUY" ? -1 : 1;
                                    if (typeof (portfolios[key]) != typeof (undefined)) openPositions = portfolios[key].length;
                                    transactionData.ticker = subscription.ticker;
                                    transactionData.type = results[0].order == "BUY" ? "buy" : "short";
                                    transactionData.stockPrice = JSON.parse(await server.yahoo.getQuote(apiPath, subscription.ticker))[subscription.ticker];
                                    transactionData.volume = Math.floor(Math.min(wallets[key][0].available - wallets[key][0].provisions,
                                        (wallets[key][0].available - wallets[key][0].provisions) / (subscriptions[key].length - openPositions),
                                        wallets[key][0].invested * 0.1) / transactionData.stockPrice);
                                    transactionData.strategy = subscription.strategy;
                                    transactionData.total = transactionData.stockPrice * transactionData.volume * multiplier;
                                    transactionData.account = key;
                                    if (transactionData.volume != 0) {
                                        //Execute Transaction with the transactionData object
                                        console.log("EXECUTED: ", subscription.ticker, " : ", subscription.candleSize, transactionData);
                                        server.transaction.postTransaction(apiPath, transactionData);
                                    }
                                }

                            }
                        })
                        .then(() => {
                            // Ticker solved
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            });
        });
    })
        .then(() => {
            console.log("_______________________________________");
            console.log("WAITING: ", "60sec");
        }).catch(err => {
            console.log(err);
        });
    setTimeout(() => {

        trader();
    }, 60000);

}
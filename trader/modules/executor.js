module.exports = async function executor(server, strategy, key, subscriptions, subscription, portfolios, wallets, results) {
    let transactionData = new Object();
    
    if (results[0].order == "HOLD") {
        //Continue to next
        console.log("SKIPPED: ", subscription.strategy, subscription.ticker, subscription.candleSize);
        return { action: "SKIPPED", strategy: subscription.strategy, ticker: subscription.ticker, candleSize: subscription.candleSize };
    }
    else {
        //Order is BUY or SELL
        //Check in Portfolio if a position is already open
        let isOpen = false;
        if (typeof (portfolios[key]) != typeof (undefined)) {
            portfolios[key].forEach(async (position) => {
                if (position.ticker == subscription.ticker) {
                    //Position is already opened
                    isOpen = true;
                    if ((position.type == "short" && results[0].order == "BUY") || (position.type == "buy" && results[0].order == "SELL")) {
                        const multiplier = results[0].order == "BUY" ? -1 : 1;
                        transactionData.ticker = subscription.ticker;
                        transactionData.type = results[0].order == "BUY" ? "cover" : "sell";
                        transactionData.stockPrice = JSON.parse(await server.yahoo.getQuote(subscription.ticker))[subscription.ticker];
                        transactionData.volume = position.volume;
                        transactionData.strategy = subscription.strategy;
                        transactionData.total = transactionData.stockPrice * transactionData.volume * multiplier;
                        transactionData.account = key;
                        const respObj = await server.transaction.postTransaction(transactionData);
                        console.log("EXECUTED: ", subscription.strategy, subscription.ticker, subscription.candleSize);
                        return {
                            action: "EXECUTED", strategy: subscription.strategy, ticker: subscription.ticker, candleSize: subscription.candleSize,
                            response: respObj
                        };
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
            transactionData.stockPrice = JSON.parse(await server.yahoo.getQuote(subscription.ticker))[subscription.ticker];
            transactionData.volume = Math.floor(Math.min(wallets[key][0].available - wallets[key][0].provisions,
                (wallets[key][0].available - wallets[key][0].provisions) / (subscriptions[key].length - openPositions),
                wallets[key][0].invested * 0.1) / transactionData.stockPrice);
            transactionData.strategy = subscription.strategy;
            transactionData.total = transactionData.stockPrice * transactionData.volume * multiplier;
            transactionData.account = key;
            if (transactionData.volume != 0) {
                //Execute Transaction with the transactionData object
                const respObj = await server.transaction.postTransaction(transactionData);
                console.log("EXECUTED: ", subscription.strategy, subscription.ticker, subscription.candleSize);
                return {
                    action: "EXECUTED", strategy: subscription.strategy, ticker: subscription.ticker, candleSize: subscription.candleSize,
                    response: respObj
                };
            }
        }

    }
}
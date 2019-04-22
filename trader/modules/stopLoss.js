const notifier = require('node-notifier');

module.exports = async function stopLoss(server, portfolios) {
    let query = new Array();
    for (portfolio of portfolios) query.push(portfolio.ticker);
    return Promise.all([await server.yahoo.getQuote(query.join(","))]).then(async values => {
        const data = JSON.parse(values);
        let stopLossArray = new Array();
        for (portfolio of portfolios) {
            if ((portfolio.type == "short" && ((portfolio.total / portfolio.volume - data[portfolio.ticker]) / (portfolio.total / portfolio.volume) <= -0.02)) ||
                (portfolio.type == "buy" && ((portfolio.total / portfolio.volume * -1 - data[portfolio.ticker]) / (portfolio.total / portfolio.volume) * -1 >= 0.02))) {
                let transactionData = new Object();
                const multiplier = portfolio.type == "short" ? -1 : 1;
                transactionData.ticker = portfolio.ticker;
                transactionData.type = portfolio.type == "short" ? "cover" : "sell";
                transactionData.stockPrice = data[portfolio.ticker];
                transactionData.volume = portfolio.volume;
                transactionData.strategy = portfolio.strategy;
                transactionData.total = transactionData.stockPrice * transactionData.volume * multiplier;
                transactionData.account = portfolio.account;
                notifier.notify({
                    title: 'STOP-LOSS',
                    message: `Ticker: ${ portfolio.ticker}, Time: ${new Date().toTimeString()}`,
                    sound: true
                });
                console.log("----> STOP_LOSS: ", portfolio.type == "short" ? "cover" : "sell", portfolio.ticker);
                stopLossArray.push(await server.transaction.postTransaction(transactionData));
            }
            else {
                stopLossArray.push(portfolio);
            }
        }
        return stopLossArray
    })
}

module.exports = async function stopLoss(server, portfolios) {
    let query = new Array();
    for (portfolio of portfolios) query.push(portfolio.ticker);
    const data = JSON.parse(await server.yahoo.getQuote(query.join(",")));

    for (portfolio of portfolios) {
        let close = false;
        if (portfolio.type == "short") if ((portfolio.total / portfolio.volume - data[portfolio.ticker]) / (portfolio.total / portfolio.volume) <= -0.02) close = true;
        else if (portfolio.type == "buy") if ((portfolio.total / portfolio.volume * -1 - data[portfolio.ticker]) / (portfolio.total / portfolio.volume) * -1 >= 0.02) close = true;
        if (close) {
            let transactionData = new Object();
            const multiplier = portfolio.type == "short" ? -1 : 1;
            transactionData.ticker = portfolio.ticker;
            transactionData.type = portfolio.type == "short" ? "cover" : "sell";
            transactionData.stockPrice = data[portfolio.ticker];
            transactionData.volume = portfolio.volume;
            transactionData.strategy = portfolio.strategy;
            transactionData.total = transactionData.stockPrice * transactionData.volume * multiplier;
            transactionData.account = portfolio.account;
            await server.transaction.postTransaction(transactionData);
            console.log("STOP_LOSS: ", portfolio.type == "short" ? "cover" : "sell", portfolio.ticker, portfolio.candleSize);
        }
    }

}

const request = require('request');

async function getQuotes(tickers, callback) {
    await request(`https://query1.finance.yahoo.com/v7/finance/spark?symbols=${tickers.join(",")}&interval=1m`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let quotes = new Array();
            for (ticker of JSON.parse(body).spark.result) {
                const close = ticker.response[0].indicators.quote[0].close;
                for (var i = close.length - 1; i >= 0; i--) {
                    if (close[i] != null) {
                        quotes.push(close[i]);
                        break;
                    }
                }
            }
            callback(null, quotes);
        }
        else {
            if (error) callback(new Error(), null);
        }
    });
}

module.exports = getQuotes;
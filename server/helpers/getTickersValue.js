const _ = require("lodash");
const request = require('request');

async function getTickersValue(tickers, portfolios, Portfolio, callback) {
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
            let positions = new Array();
            for (p in quotes) {
                if (portfolios[p].type == "buy") {
                    positions.push(_.extend(_.pick(portfolios[p], Portfolio.fillable), {
                        value: quotes[p] * portfolios[p].volume,
                        price: -portfolios[p].total,
                        profit: (quotes[p] * portfolios[p].volume) + portfolios[p].total
                    }));
                }
                else if (portfolios[p].type == "short") {
                    positions.push(_.extend(_.pick(portfolios[p], Portfolio.fillable), {
                        value: quotes[p] * portfolios[p].volume,
                        price: portfolios[p].total,
                        profit: portfolios[p].total - (quotes[p] * portfolios[p].volume)
                    }));
                }
            }
            callback(null, positions);
        }
        else {
            if (error) callback(new Error(), null);
        }
    });
}

module.exports = getTickersValue;
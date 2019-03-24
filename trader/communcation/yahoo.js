const request = require('request');

async function getChart(apiPath, ticker, interval, range) {
    const p = new Promise((resolve, reject) => {
        request(`${apiPath}/quotes/candles/${ticker}/${interval}/${range}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(error);
            }
        });
    });
    return p.then(values => {
        return values;
    }).catch(error => {
        return error;
    })
}

async function getChart(apiPath, ticker, interval, range) {
    const p = new Promise((resolve, reject) => {
        request(`${apiPath}/quotes/candles/${ticker}/${interval}/${range}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(error);
            }
        });
    });
    return p.then(values => {
        return values;
    }).catch(error => {
        return error;
    })
}

async function getQuote(apiPath, tickers) {
    const p = new Promise((resolve, reject) => {
        request(`${apiPath}/quotes/quote/${tickers}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                reject(error);
            }
        });
    });
    return p.then(values => {
        return values;
    }).catch(error => {
        return error;
    })
}

module.exports.yahoo = { getChart, getQuote }
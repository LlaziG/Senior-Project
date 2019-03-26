const config = require('config');
const apiPath = config.get('apiPath');

const request = require('request');

async function getChart(ticker, interval, range) {
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

async function getChart(ticker, interval, range) {
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

async function getQuote(tickers) {
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

async function isActiveHours() {
    const p = new Promise((resolve, reject) => {
        request(`${apiPath}/quotes/activeHours`, function (error, response, body) {
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

module.exports.yahoo = { getChart, getQuote, isActiveHours }
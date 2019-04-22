const express = require('express');
const router = express.Router();

const request = require('request');

const { asyncEH } = require('../middleware/index');
let autoSuggestCache = new Object();

router.get('/candles/:ticker/:candleSize/:period', asyncEH(async (req, res) => {
	request(`https://query1.finance.yahoo.com/v7/finance/chart/${req.params.ticker}?interval=${req.params.candleSize}&range=${req.params.period}`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send(JSON.parse(body));
		}
		else {
			res.status(400).send({ error: 'Bad Request' });
		}
	});
}));
router.get('/companies/:search', asyncEH(async (req, res) => {
	if (autoSuggestCache[req.params.search]) {
		res.send(autoSuggestCache[req.params.search]);
	} else {
		request(`https://query1.finance.yahoo.com/v1/finance/search?q=${req.params.search}&quotesCount=6&newsCount=0`, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let suggestions = JSON.parse(body).quotes.map(quote => {
					return {
						symbol: quote.symbol,
						name: quote.shortname
					}
				});
				autoSuggestCache[req.params.search] = {
					results: suggestions
				};
				res.send(autoSuggestCache[req.params.search]);
			}
			else {
				res.status(400).send({ error: 'Bad Request' });
			}
		});
	}
}));

router.get('/quote/:tickers', asyncEH(async (req, res) => {
	request(`https://query1.finance.yahoo.com/v7/finance/quote?formatted=true&symbols=${req.params.tickers}`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let quotes = new Object();
			const tickers = req.params.tickers.split(",");
			for (i in JSON.parse(body).quoteResponse.result) {
				quotes[tickers[i]] = JSON.parse(body).quoteResponse.result[i].regularMarketPrice.raw
			}
			res.send(quotes);
		}
		else {
			res.status(400).send({ error: 'Bad Request' });
		}
	});
}));

router.get('/activeHours', asyncEH(async (req, res) => {
	request(`https://query1.finance.yahoo.com/v7/finance/quote?formatted=true&symbols=AAPL`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send({ marketState: JSON.parse(body).quoteResponse.result[0].marketState });
		}
		else {
			res.status(400).send({ error: 'Bad Request' });
		}
	});
}));

module.exports = router;
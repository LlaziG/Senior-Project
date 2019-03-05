const express = require('express');
const router = express.Router();

const request = require('request');

const { asyncEH } = require('../middleware/index');

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
	request(`https://query1.finance.yahoo.com/v1/finance/search?q=${req.params.search}&quotesCount=6&newsCount=0`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			let suggestions = JSON.parse(body).quotes.map(quote => {
				return {
					symbol: quote.symbol,
					name: quote.shortname
				}
			});
			res.send({
				results: suggestions
			});
		}
		else {
			res.status(400).send({ error: 'Bad Request' });
		}
	});
}));

module.exports = router;
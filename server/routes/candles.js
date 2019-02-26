const express = require('express');
const router = express.Router();

const request = require('request');

const { asyncEH } = require('../middleware/index');

router.get('/:ticker/:candleSize/:period', asyncEH(async (req, res) => {
	request(`https://query1.finance.yahoo.com/v7/finance/chart/${req.params.ticker}?interval=${req.params.candleSize}&range=${req.params.period}`, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send(body);
		}
		else {
			console.log("ERR", error);
		}
	});
}));

module.exports = router;
const request = require('request');
const mongoose = require('mongoose');
const config = require('config');
const logger = require('./middleware/logger');
const express = require('express');
const transactions = require('./routes/transactions');
const app = express();

mongoose.connect('mongodb://localhost/')
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect to MongoDB'));
app.use(logger);
app.get('/api/:ticker/:candleSize/:period', (req, res) => {
	request(`https://query1.finance.yahoo.com/v7/finance/chart/${req.params.ticker}?interval=${req.params.candleSize}&range=${req.params.period}`, function (error, response, body) {	
		if (!error && response.statusCode == 200) {
			res.send(body);
		}
		else{
			console.log("ERR", error);
		}
	});
});
app.use('/api/transactions', transactions);
const port = config.get("port") || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}...`));
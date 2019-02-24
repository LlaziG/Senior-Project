const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const express = require('express');

const logger = require('./middleware/logger');

const candles = require('./routes/candles');
const accounts = require('./routes/accounts');
const transactions = require('./routes/transactions');
const cors = require('cors');

if(!config.get('jwtPrivateKey')) {
	console.error('FATAL ERROR: jwtPrivateKey is not defined');
	process.exit(1);
}
const app = express();
mongoose.connect('mongodb://localhost/trader', {useNewUrlParser : true})
	.then(() => console.log('Connected to MongoDB...'))
	.catch(err => console.log('Could not connect to MongoDB'));

app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api/candles', candles);
app.use('/api/accounts', accounts);
app.use('/api/transactions', transactions);

const port = config.get("port") || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}...`));
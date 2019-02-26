const express = require('express');
const { candles, accounts, transactions } = require('../routes/index');
const { error, logger } = require('../middleware/index');
const cors = require('cors');

module.exports = function(app){
    app.use(cors());
    app.use(express.json());
    app.use(logger);
    app.use('/api/candles', candles);
    
    app.use('/api/transactions', transactions);
    app.use('/api/accounts', accounts);
    app.use(error);
}
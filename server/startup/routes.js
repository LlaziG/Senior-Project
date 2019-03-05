const express = require('express');
const { quotes, accounts, transactions, wallets, subscriptions } = require('../routes/index');
const { error, logger } = require('../middleware/index');
const cors = require('cors');

module.exports = function (app) {
    app.use(cors());
    app.use(express.json());
    app.use(logger);
    app.use('/api/quotes', quotes);

    app.use('/api/transactions', transactions);
    app.use('/api/accounts', accounts);
    app.use('/api/wallets', wallets);
    app.use('/api/subscriptions', subscriptions);
    app.use(error);
}
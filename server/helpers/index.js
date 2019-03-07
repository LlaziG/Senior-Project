const generateWallet = require('./generateWallet');
const { defaultLogger } = require('./loggers');
const getQuotes = require('./getQuotes');
const updatePortfolio = require('./updatePortfolio');
const updateSubscription = require('./updateSubscription');
const updateWallet = require('./updateWallet');

module.exports = { generateWallet, defaultLogger, getQuotes, updatePortfolio, updateSubscription, updateWallet }
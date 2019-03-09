const generateWallet = require('./generateWallet');
const { defaultLogger } = require('./loggers');
const getTickersValue = require('./getTickersValue');
const updatePortfolio = require('./updatePortfolio');
const updateSubscription = require('./updateSubscription');
const updateWallet = require('./updateWallet');
const updateStrategy = require('./updateStrategy');

module.exports = { generateWallet, defaultLogger, getTickersValue, updatePortfolio, updateSubscription, updateWallet, updateStrategy }
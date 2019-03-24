const express = require('express');
const router = express.Router();


const { Portfolio, validate } = require('../models/portfolios');
const { auth, asyncEH } = require('../middleware/index');
const { getTickersValue } = require('../helpers/index');


router.get("/ticker/:ticker", auth, asyncEH(async (req, res) => {
    const portfolio = await Portfolio.findOne({
        account: req.user._id,
        ticker: req.params.ticker
    });

    if (!portfolio) return res.status(400).send({});

    await getTickersValue([req.params.ticker], portfolio, Portfolio, function (e, positions) {
        res.send(positions);
    });
}));

router.get("/", asyncEH(async (req, res) => {
    const portfolios = await Portfolio.find().sort('account');
    if (portfolios.length == 0) res.send([]);
    let tickers = new Array();
    for (p of portfolios) tickers.push(p.ticker);
    await getTickersValue(tickers, portfolios, Portfolio, function (e, positions) {
        res.send(positions);
    });
}));

router.get("/me", auth, asyncEH(async (req, res) => {
    const portfolios = await Portfolio.find({ account: req.user._id }).sort('ticker');

    if (!portfolios) return res.send({});
    let tickers = new Array();
    for (p of portfolios) tickers.push(p.ticker);
    await getTickersValue(tickers, portfolios, Portfolio, function (e, positions) {
        res.send(positions);
    });
}));

router.get("/search", asyncEH(async (req, res) => {
    const portfolio = await Portfolio.findOne({
        account: req.body.account,
        ticker: req.body.ticker
    });
    if (!portfolio) return res.send({});
    res.send(portfolio);
}));

module.exports = router;
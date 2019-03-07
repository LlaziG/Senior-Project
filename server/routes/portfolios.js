const _ = require("lodash");

const express = require('express');
const router = express.Router();


const { Portfolio, validate } = require('../models/portfolios');
const { auth, asyncEH } = require('../middleware/index');
const { getQuotes } = require('../helpers/index');


router.get("/ticker/:ticker", auth, asyncEH(async (req, res) => {
    const portfolio = await Portfolio.findOne({
        account: req.user._id,
        ticker: req.params.ticker
    });

    if (!portfolio) return res.status(400).send({});

    const quotes = getQuotes([req.params.ticker]);
    res.send(_.extend(_.pick(portfolio, Portfolio.fillable), { value: quotes[0] * portfolio.volume }));
}));

router.get("/me", auth, asyncEH(async (req, res) => {
    const portfolios = await Portfolio.find({ account: req.user._id }).sort('ticker');

    if (!portfolios) return res.send({});
    let tickers = new Array();
    for (p of portfolios) tickers.push(p.ticker);
    await getQuotes(tickers, function (e, quotes) {
        let positions = new Array();
        for (p in quotes) {
            if (portfolios[p].type == "buy") {
                positions.push(_.extend(_.pick(portfolios[p], Portfolio.fillable), {
                    value: quotes[p] * portfolios[p].volume,
                    price: -portfolios[p].total,
                    profit: (quotes[p] * portfolios[p].volume) + portfolios[p].total
                }));
            }
            else if (portfolios[p].type == "short") {
                positions.push(_.extend(_.pick(portfolios[p], Portfolio.fillable), {
                    value: quotes[p] * portfolios[p].volume,
                    price: portfolios[p].total,
                    profit: portfolios[p].total - (quotes[p] * portfolios[p].volume)
                }));
            }
        }
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
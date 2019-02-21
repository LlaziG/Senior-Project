const mongoose = require('mongoose');
const { Transaction, validate } = require('../models/transactions');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const transactions = await transactions.find().sort('date');
    res.send(transactions);
});
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let transaction = new Transaction({
        account : req.body.account,
        ticker : req.body.ticker,
        dateTime : req.body.dateTime,
        stockPrice : req.body.stockPrice,
        type : req.body.type,
        volume : req.body.volume
    });
    transaction = await transaction.save();
    res.send(transaction);
});

module.exports = router;
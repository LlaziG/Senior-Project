const mongoose = require('mongoose');
const _ = require("lodash");
const { Transaction, validate } = require('../models/transactions');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const transactions = await transactions.find().sort('date');
    res.send(transactions);
});
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let transaction = new Transaction( _.pick(reg.body , ['account', 'ticker', 'dateTime', 'stockPrice', 'type', 'type', 'volume']));
    transaction = await transaction.save();
    res.send(transaction);
});

module.exports = router;
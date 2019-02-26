const express = require('express');
const router = express.Router();

const _ = require("lodash");

const { Transaction, validate } = require('../models/transactions');
const { asyncEH } = require('../middleware/index');


router.get('/', asyncEH(async (req, res) => {
    const transactions = await Transaction.find().sort('date');
    res.send(transactions);
}));
router.post('/', asyncEH(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let transaction = new Transaction(_.pick(reg.body, ['account', 'ticker', 'dateTime', 'stockPrice', 'type', 'type', 'volume']));
    transaction = await transaction.save();
    res.send(transaction);
}));

module.exports = router;
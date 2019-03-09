const express = require('express');
const router = express.Router();

const _ = require("lodash");

const { Wallet, validate } = require('../models/wallet');
const { auth, asyncEH } = require('../middleware/index');


router.get('/wallet/:id', asyncEH(async (req, res) => {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(400).send("Bad Request");

    res.send(wallet);
}));
router.get('/me', auth, asyncEH(async (req, res) => {
    const wallet = await Wallet.findOne({ account: req.user._id });
    if (!wallet) return res.status(400).send("Bad Request");

    res.send(wallet);
}));

router.put('/wallet/:id', asyncEH(async (req, res) => {
    const wallet = await Wallet.findById(req.params.id);
    if (!wallet) return res.status(400).send("Bad Request");

    _.extend(wallet, req.body);
    const { error } = validate(_.pick(wallet, Wallet.fillable));
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    wallet.save();
    res.send(wallet);
}));
module.exports = router;
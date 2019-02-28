const _ = require("lodash");
const bcrypt = require("bcrypt");

const express = require('express');
const router = express.Router();
const request = require('request');

const { Account, validate, validateAuth } = require('../models/accounts');
const { auth, asyncEH } = require('../middleware/index');
const { generateWallet } = require('../helpers/index');

router.post('/', asyncEH(async (req, res) => {
    const wallet = await generateWallet();
    let accObj = req.body;
    accObj.wallet = String(wallet._id);

    const { error } = validate(accObj);
    if (error) return res.status(400).send(error.details[0].message);

    let account = await Account.findOne({ email: req.body.email });
    if (account) return res.status(400).send("Email already exists");

    account = new Account(_.pick(accObj, ['name', 'email', 'password', 'wallet']));
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);

    account = await account.save();
    res.send(_.pick(account, ['id', 'name', 'email', 'wallet']));
}));

router.post('/authenticate', asyncEH(async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let account = await Account.findOne({ email: req.body.email });
    if (!account) return res.status(400).send("Wrong Credentials");

    const validPassword = await bcrypt.compare(req.body.password, account.password);
    if (!validPassword) return res.status(400).send("Wrong Credentials");

    const token = account.generateAuthToken();
    res.header(token).status(200).send(
        {
            account: {
                email: account.email,
                name: account.name,
                token: token
            }
        }).end();
}));

router.get("/me", auth, asyncEH(async (req, res) => {
    const account = await Account.findById(req.user._id).select('-password');
    if (!account) return res.status(400).send("Bad Request");
    res.send(account);
}));
module.exports = router;
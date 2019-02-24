const mongoose = require('mongoose');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Account, validate, validateAuth } = require('../models/accounts');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let account = await Account.findOne({ email : req.body.email});
    if(account) return res.status(400).send("Email already exists");
    
    account = new Account( _.pick(req.body, ['name', 'email', 'password', 'initialCash', 'availableCash']));
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);

    account = await account.save();
    res.send(_.pick(account, ['id', 'name', 'email']));
});

router.post('/authenticate', async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let account = await Account.findOne({ email : req.body.email});
    if(!account) return res.status(400).send("Wrong Credentials");
    
    const validPassword = await bcrypt.compare(req.body.password, account.password);
    if (!validPassword) return res.status(400).send("Wrong Credentials");

    const token = account.generateAuthToken();
    res.header(token).status(200).send(
        {
            account : {
                email : account.email,
                name : account.name,
                token : token
            }
        }).end();
});

router.get("/me", auth, async(req, res) => {
    const account = await Account.findById(req.user._id).select('-password');
    res.send(account);
});
module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const { Strategy, validate } = require('../models/strategies');
const { auth, asyncEH } = require('../middleware/index');


router.post("/", asyncEH(async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    let strategy = new Strategy(req.body);
    strategy = await strategy.save();
    res.send(strategy);
}));

router.get("/me/dates", auth, asyncEH(async (req, res) => {
    const strategies = await Strategy.aggregate([
        { $match: { account: ObjectId(req.user._id) } },
        {
            $group:
            {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    day: { $dayOfMonth: "$date" },
                    strategy: "$strategy"
                },
                profit: { $sum: "$profit" }
            }
        },
        { $sort: { "_id.strategy": 1, "_id.year": 1, "_id.month": 1, "_id.day": 1 } }]);

    if (strategies.length == 0) return res.send([]);

    res.send(strategies);
}));

router.get("/me/grouped", auth, asyncEH(async (req, res) => {
    const strategies = await Strategy.aggregate([
        { $match: { account: ObjectId(req.user._id) } },
        {
            $group:
            {
                _id: {
                    strategy: "$strategy",
                    ticker: "$ticker"
                },
                profit: { $sum: "$profit" }
            }
        }]);
    if (strategies.length == 0) return res.send([]);

    res.send(strategies);
}));

router.get("/me/year", auth, asyncEH(async (req, res) => {
    const strategies = await Strategy.aggregate([
        { $match: { account: ObjectId(req.user._id) } },
        {
            $group:
            {
                _id: {
                    year: { $year: "$date" }
                },
                profit: { $sum: "$profit" }
            }
        },
        { $sort: { "_id.year": -1} },
        { $limit: 2 }
    ]);

    if (strategies.length == 0) return res.send([]);

    res.send(strategies);
}));

router.get("/me/month", auth, asyncEH(async (req, res) => {
    const strategies = await Strategy.aggregate([
        { $match: { account: ObjectId(req.user._id) } },
        {
            $group:
            {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                profit: { $sum: "$profit" }
            }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 2 }
    ]);

    if (strategies.length == 0) return res.send([]);

    res.send(strategies);
}));

router.get("/me/day", auth, asyncEH(async (req, res) => {
    const strategies = await Strategy.aggregate([
        { $match: { account: ObjectId(req.user._id) } },
        {
            $group:
            {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    day: { $dayOfMonth: "$date" }
                },
                profit: { $sum: "$profit" }
            }
        },
        { $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 } },
        { $limit: 2 }
    ]);

    if (strategies.length == 0) return res.send([]);

    res.send(strategies);
}));

module.exports = router;
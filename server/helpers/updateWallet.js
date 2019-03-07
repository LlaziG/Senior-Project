const _ = require("lodash");

const { Wallet } = require('../models/wallet');

async function updateWallet(obj) {
    if (_.isUndefined(obj.wallet)) {
        let wallet = await Wallet.findOne({
            account: obj.account
        });
        if (obj.type == "short") {
            _.extend(wallet, {
                provisions: wallet.provisions + obj.available,
                available: wallet.available + obj.available
            });
        }
        else if (obj.type == "cover") {
            _.extend(wallet, {
                provisions: wallet.provisions - obj.previous,
                available: wallet.available + obj.available
            });
        }
        else {
            _.extend(wallet, { available: wallet.available + obj.available });
        }
        wallet.save();
        return wallet;
    }
    else {
        let wallet = await Wallet.findById(obj.wallet);
        _.extend(wallet, { account: obj.account.id });
        wallet.save();
        return wallet;
    }
}

module.exports = updateWallet;
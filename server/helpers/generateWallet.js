const { Wallet, validate } = require('../models/wallet');

async function generateWallet() {
    const walletObj = { invested: 0, available: 0, provisions: 0 };
    const { error } = validate(walletObj);
    if (error) return new Error(error.details[0].message);

    let wallet = new Wallet(walletObj);
    wallet = await wallet.save();
    return wallet;
}

module.exports = generateWallet;
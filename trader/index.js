const server = require('./communcation/index');
const trader = require('./modules/trader'); //Trader Module
const strategySelector = require('./modules/strategySelector'); //StrategySelector Module

let strategySelectorFlag = false;
let traderComplete = true;

setInterval(async () => {
    const market = await server.yahoo.isActiveHours();
    if (market.marketState == "REGULAR") {
        if (traderComplete) {
            traderComplete = false;
            strategySelectorFlag = false;
            const response = await trader(); //Start Trader
            if (response.isComplete == true) traderComplete = true;

        }
    }
    else if (!strategySelectorFlag) {
        console.log("Time For Selecting");
        strategySelector();
        strategySelectorFlag = true;
    }
}, 10000)
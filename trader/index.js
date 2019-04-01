const server = require('./communcation/index');
const trader = require('./modules/trader'); //Trader Module
const strategySelector = require('./modules/strategySelector'); //StrategySelector Module

async function traderModules() {
    const market = await server.yahoo.isActiveHours();
    if (market.marketState == "REGULAR") {
        trader(); //Start Trader
        strategySelectorFlag = false;
    }
    else if (!strategySelectorFlag) {
        console.log("Time For Selecting");
        strategySelector();
        strategySelectorFlag = true;
    }

    setTimeout(() => { traderModules(); }, 20000);
}
traderModules();
let strategySelectorFlag = false;


const server = require('./communcation/index');
const trader = require('./modules/trader'); //Trader Module
const strategySelector = require('./modules/strategySelector'); //StrategySelector Module


let strategySelectorFlag = false;
let strategyComplete = true;
let traderComplete = true;
let forceSelection = false;
process.argv.forEach(val => {
    val == "-forceSelection"
        ? (forceSelection = true, console.log("Forcing Strategy Selection"))
        : forceSelection = false;
});

setInterval(async () => {
    const market = await server.yahoo.isActiveHours();
    if (market) {
        if (!forceSelection && market.marketState == "REGULAR") {
            if (traderComplete && strategyComplete) {
                traderComplete = false;
                strategySelectorFlag = false;
                const response = await trader(); //Start Trader
                if (response.isComplete == true) traderComplete = true;
            }
        }
        else if (!strategySelectorFlag) {
            console.log("Time For Selecting");
            strategyComplete = false;
            strategySelectorFlag = true;
            forceSelection = false;
            const response = await strategySelector(); // Start strategySelction
            if (response.isComplete == true) strategyComplete = true;
        }
    }
}, 10000)
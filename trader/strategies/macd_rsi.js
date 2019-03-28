var taMath = require("ta-math");

const crossover = (x, y, i) => {
    i = i || x.length - 1;
    if (typeof (y) == "number") return (x[i - 1] > 0 && x[i] <= 0) ? true : false;
    return (x[i - 1] > y[i - 1] && x[i] <= y[i]) ? true : false;
}
const crossunder = (x, y, i) => {
    i = i || x.length - 1;
    if (typeof (y) == "number") return (x[i - 1] < 0 && x[i] >= 0) ? true : false;
    return (x[i - 1] < y[i - 1] && x[i] >= y[i]) ? true : false;
}

function getQuote(ohlcv, type) {
    const ta = new taMath(ohlcv, taMath.objectFormat);
    if (type == "now") { return calculateStrategy(ta, ohlcv.close.length - 1, ohlcv.close.length, ohlcv.time) }
    else if (type == "all") { return calculateStrategy(ta, 0, ohlcv.close.length, ohlcv.time) }
}
function calculateStrategy(ta, begin, end, timestamp) {
    const macd = taMath.macd(ta.$close);
    const rsi = taMath.rsi(ta.$close, 14);
    const delta = new Array();
    for (let i = 0; i < macd.line.length; i++) delta.push(macd.line[i] - macd.signal[i]);

    const OverBought = 71;
    const OverSold = 100 - OverBought;
    let results = new Array();

    for (let i = begin; i < end; i++) {
        if (crossover(delta, 0, i) && rsi[i] < OverSold) {
            results.push({ "order": "BUY", "timestamp": timestamp[i], "candleNo": i });
        }
        else if (crossunder(delta, 0, i) && rsi[i] > OverBought) {
            results.push({ "order": "SELL", "timestamp": timestamp[i], "candleNo": i });
        }
        else {
            results.push({ "order": "HOLD", "timestamp": timestamp[i], "candleNo": i });
        }
    }
    return results;
}
module.exports.macd_rsi = { getQuote };
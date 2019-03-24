module.exports.formatTOHLCV = (x) => {
    return {
        time: x.timestamp,
        open: x.indicators.quote[0].open,
        close: x.indicators.quote[0].close,
        high: x.indicators.quote[0].high,
        low: x.indicators.quote[0].low,
        volume: x.indicators.quote[0].volume
    }
}
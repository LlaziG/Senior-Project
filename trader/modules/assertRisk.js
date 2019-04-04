const math = require('mathjs');
module.exports = function assertRisk(ohclv, ohclvUSD) {
    if (ohclv.close.length < 10 || ohclvUSD.close.length < 10) return 0;
    const stockExpLast = [1 / (1 + ohclv.close[ohclv.close.length - 1] / 100) ^ 2];
    const usdExpLast = [1 / (1 + ohclvUSD.close[ohclvUSD.close.length - 1] / 100) ^ 2];
    const usdMedian = ohclvUSD.close[100];

    let stock = {
        factor: [1 / (1 + ohclv.close[0] / 100) ^ 2],
        factorReturn: [0],
        factorExp: [0],
        value: [usdMedian * (1 / (1 + ohclv.close[0] / 100) ^ 2) / ohclvUSD.close[0]]
    }
    let usd = {
        factor: [ohclvUSD.close[0]],
        factorReturn: [0],
        factorExp: [0],
        value: [0]
    }


    for (let i = 1; i < ohclv.close.length; i++) {
        stock.factor.push[1 / (1 + ohclv.close[i] / 100) ^ 2];
        usd.factor.push[ohclvUSD.close[i]];

        stock.factorReturn.push(math.log(ohclv.close[i] / ohclv.close[i - 1], Math.E));
        usd.factorReturn.push(math.log(ohclvUSD.close[i] / ohclvUSD.close[i - 1], Math.E));

        stock.factorExp.push(math.exp(stock.factorReturn[i]) * stockExpLast);
        usd.factorExp.push(math.exp(usd.factorReturn[i]) * usdExpLast);

        stock.value.push(stock.factorExp[i] / usd.factorExp[i]);
        usd.value.push(stock.factor[i] / usd.factor[i]);
    }

    let sorted = mergeSort(filter_array(stock.value));
    return 1 - sorted[Math.ceil(sorted.length * 0.05)] * math.median(filter_array(ohclvUSD.close));
}
function filter_array(arr) {
    let index = -1,
        arr_length = arr ? arr.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        let value = arr[index];

        if (value || value == Infinity) {
            result[++resIndex] = value;
        }
    }

    return result;
}

function mergeSort(arr) {
    let len = arr.length;
    if (len < 2)
        return arr;
    let mid = Math.floor(len / 2),
        left = arr.slice(0, mid),
        right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right) {
    let result = [],
        lLen = left.length,
        rLen = right.length,
        l = 0,
        r = 0;
    while (l < lLen && r < rLen) {
        if (left[l] < right[r]) {
            result.push(left[l++]);
        }
        else {
            result.push(right[r++]);
        }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
}
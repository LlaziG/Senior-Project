module.exports.splitObjByAccounts = function (obj, results) {
    results.forEach(result => {
        if (Object.keys(obj).indexOf(result.account) == -1) {
            obj[result.account] = [result]
        } else {
            obj[result.account].push(result);
        }
    });
}
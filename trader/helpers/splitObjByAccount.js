module.exports.splitObjByAccounts = function (results) {
    let obj = new Object();
    try {
        results.forEach(result => {
            if (Object.keys(obj).indexOf(result.account) == -1) {
                obj[result.account] = [result]
            } else {
                obj[result.account].push(result);
            }
        });
        return obj;
    }
    catch (err) {
        return new Error(err);
    }
}
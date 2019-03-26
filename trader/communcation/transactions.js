const config = require('config');
const apiPath = config.get('apiPath');

const request = require('request');

async function postTransaction(obj) {
    const p = new Promise((resolve, reject) => {
        request.post({
            headers: { 'content-type': 'application/json' },
            url: `${apiPath}/transactions`,
            json: obj
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                console.log("IN POST TRANSACTION REJECTED: ", error, response, obj);
                reject(error);
            }
        });
    });
    return p.then(values => {
        return values;
    }).catch(error => {
        return error;
    })
}
module.exports.transaction = { postTransaction }

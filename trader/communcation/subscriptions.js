const config = require('config');
const apiPath = config.get('apiPath');

const request = require('request');

async function getSubscriptions() {
    const p = new Promise((resolve, reject) => {
        request(`${apiPath}/subscriptions`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(JSON.parse(body));
            }
            else {
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
async function updateStrategy(id, obj) {
    const p = new Promise((resolve, reject) => {
        request.put({
            headers: { 'content-type': 'application/json' },
            url: `${apiPath}/subscriptions/${id}`,
            json: obj
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(body);
            }
            else {
                console.log("IN UPDATE STRATEGY REJECTED: ", error, response, obj);
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
module.exports.subscription = { getSubscriptions, updateStrategy }
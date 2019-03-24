const request = require('request');

async function getSubscriptions(apiPath) {
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
module.exports.subscription = { getSubscriptions }
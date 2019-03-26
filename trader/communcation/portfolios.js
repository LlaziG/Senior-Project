const config = require('config');
const apiPath = config.get('apiPath');

const request = require('request');

async function getPortfolios() {
    const p = new Promise((resolve, reject) => {
        request(`${apiPath}/portfolios`, function (error, response, body) {
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
module.exports.portfolio = { getPortfolios }

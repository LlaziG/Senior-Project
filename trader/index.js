const config = require('config');

const server = require('./communcation/index');
const helper = require('./helpers/index');
const strategy = require('./strategies/index');
const apiPath = config.get('apiPath');

require('./startup/trader')(server, helper, strategy, apiPath);
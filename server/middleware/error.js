const {defaultLogger} = require('../startup/loggers');

function error(err, req, res, next){
    defaultLogger.error(err.message, err);

    res.status(500).send('Something Failed.');
}
module.exports = error;
const { defaultLogger } = require('./startup/loggers');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => {
	defaultLogger.info(`Listening on Port ${port}...`);

});
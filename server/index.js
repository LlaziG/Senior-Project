const { defaultLogger } = require('./helpers/index');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/validation')();


app.listen(port, () => {
	defaultLogger.info(`Listening on Port ${port}...`);

});
const {defaultLogger} = require('./loggers');
const mongoose = require('mongoose');

module.exports = function(){
    mongoose.connect('mongodb://localhost/trader', {useNewUrlParser : true})
        .then(() => defaultLogger.info('Connected to MongoDB...'))
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
}
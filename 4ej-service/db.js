const mongoose = require('mongoose');
const config = require('./config/secrets');
mongoose.connect(config.mdbConnectionStr, { useMongoClient: true });
const db = mongoose.connection;

db.on('error', function(){
    console.log("error connection");
});
db.once('open', function() {
    console.log("opened connection");
});
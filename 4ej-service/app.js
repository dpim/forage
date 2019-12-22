const express = require('express');        
const app = express();                 
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;   
const routes = require('./routes');
const passport = require('passport');
const strategy = require('passport-http-bearer').Strategy;
var helper = require('./helpers');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json( {limit: '50mb'} ));
app.use(bodyParser.urlencoded( {limit: '50mb', extended: true} ));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', routes);

passport.use(new strategy(
  (token, cb) => {
    helper.getUsersByToken(token, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
  });
}));

app.listen(port, () => {
    console.log('App listening on port ', port);
});
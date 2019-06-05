const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const admin = require('./api/admin');
const users = require('./api/user');
const auth = require('./api/auth');

const morgan = require('morgan');
const { logger } = require('./utils/util');

var app = express();

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, content-type, cache-control');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  // Pass to next layer of middleware
  next();
});

app.use(helmet());
app.use(morgan(':method :url :status :date'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '30mb', type: 'application/json' }));
app.set('trust proxy', true);

app.use('/admin', admin);
app.use('/users', users);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  logger.warn(`404 - ${req.ip} - ${req.method} - ${req.url}`);
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: res.locals.message });
});

console.log(`Backend running int the PORT: ${process.env.PORT}!`);
module.exports = app;

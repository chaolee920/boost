const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.DB_URI);

require('dotenv').config();

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Use the session middleware
app.use(cookieParser());

//-------------
const port = process.env.PORT || 7001; // set our port

// CREATE OUR ROUTER
require('./route')(app);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Requests on port:' + port);

exports = module.exports = app;

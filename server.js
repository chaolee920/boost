const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const rank = require('./api/ranks/cron');
const request = require('request');
const axios = require('axios');
const querystring = require('querystring');
const async = require('async');

// mongoose.connect(config.DB_URI);

require('dotenv').config();

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.text());

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

// Use the session middleware
app.use(cookieParser());

const ALCHEMY_AUTH_TOKEN = process.env.ALCHEMY_AUTH_TOKEN || 'lbEuNJWs9L3tEcwAgGRgTaa4K5HkAZCB';
const ALCHEMY_APP_ID = process.env.ALCHEMY_APP_ID || 'bv68ex5hot8vj0yl';
const ALCHMEY_API_KEY = process.env.ALCHMEY_API_KEY || '0uOGCRgiQKThWcxY0Pc14chod0zl79fH';

//-------------
const port = process.env.PORT || 7001; // set our port

// CREATE OUR ROUTER
require('./route')(app);

const API_URLS = {
  'dev': 'https://dev-graphql-apis.equeum.com',
  'qa': 'https://qa-graphql-apis.equeum.com',
  'prod': 'https://graphql-apis.equeum.com',
};
const UPDATE_EXTERNAL_TIMESERIES_MUTATION = `
mutation updateExternalTimeSeries($resourceName: String!, $timestamp: Float!, $data: Float!){
  updateExternalTimeSeries(resourceName: $resourceName, timestamp: $timestamp, data: $data) {
    id
    name
  }
}`;
const LOAD_RESOURCE_DATA_MUTATION = `
mutation loadResourceData($name: String!){
  loadResourceData(name: $name) {
    csvData
  }
}`;


const throwError = (code, message) => {
  throw { code, message };
};

// This function extract the common params like api_url, token,...
const getReqParams = (req) => {
if (req.headers['content-type'] !== 'text/plain') {
    throwError(405, 'Invalid content type');
  }
  return {
    apiURL: API_URLS[req.headers['env'] || 'dev'],
    token: req.query['token'],
  };
};

async function checkAuthentication(token, apiURL) {
  try {
    if (!token) throw new Error('Toke not found');
    const { data } = await axios.get(apiURL + '/accounts/users/auth0/accessToken?refreshToken=' + token);
    return {
      'authorization': 'Bearer ' + data,
    };
  } catch (e) {
    console.log('checkAuthentication', e);
    throwError(401, 'UnauthorizedError: No authorization token was found');
  }
}

app.post('/test/:resourceName', async function (req, res) {
	console.log('--start--')

  try {
    const { apiURL, token, resourceName } = getReqParams(req);
    const headers = await checkAuthentication(token, apiURL);
    const timestampRegex1 = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(Z)?$/;
    const timestampRegex2 = /^(-?(?:[1-9][0-9]*)?[0-9]{4})(1[0-2]|0[1-9])(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9])(Z)?$/;
    const timestampRegex3 = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9]).([0-9][0-9][0-9])(Z)?$/;
    const timestampRegex4 = /^(-?(?:[1-9][0-9]*)?[0-9]{4})(1[0-2]|0[1-9])(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9])([0-5][0-9])([0-5][0-9]).([0-9][0-9][0-9])(Z)?$/;

    const datas = req.body.split(',');
    const dataToPost = {};
    const now = new Date();

    if (datas[0] && datas[1]) {
      if (!timestampRegex1.test(datas[0]) && !timestampRegex2.test(datas[0]) && !timestampRegex3.test(datas[0]) && !timestampRegex4.test(datas[0])) {
        throwError(409, 'Invalid timestamp format');
      }
      if (Math.abs(now.getTime() - (new Date(datas[0])).getTime()) > 60000) {
        throwError(409, 'Timestamp too far from current time');
      }
      if (isNaN(datas[1])) {
        throwError(409, 'Invalid value');
      }
      if (parseFloat(datas[1]) >= Number.MAX_SAFE_INTEGER) {
        throwError(409, 'Outside of allowed value range');
      }
      dataToPost.timestamp = now.getTime();
      dataToPost.value = parseFloat(datas[1]);
    } else throwError(409, 'Invalid data');
    const response = await axios.post(apiURL + '/graphql', {
      query: UPDATE_EXTERNAL_TIMESERIES_MUTATION,
      variables: {
        resourceName,
        timestamp: dataToPost.timestamp,
        data: dataToPost.value,
      },
    }, { headers });
    if (response.data.errors) throw response.data.errors[0];
    else if (response.data.data.updateExternalTimeSeries === null) throwError(409, 'Resource Not Found!');
    res.status(202).send(response.data);
  } catch (err) {
    console.log(JSON.stringify(err))
    res.status(err.code || 501).send({ message: err.message });
  }
});





app.get('/test/:resourceName', async function (req, res) {
  console.log('--start--')
  console.log(((req.params[0] && req.params[0].split('/')[1]) || req.params.resourceName || ''))
  const { offset = 0, limit = 10 } = req.query;


  try {
    const { data } = await axios.get(`https://api.opensea.io/api/v1/collections?offset=${offset}&limit=${limit}`);
    res.status(200).send(data)
  } catch (e) {
    console.log(e);
    res.status(200).send('err')
  }
});




// START THE SERVER
// =============================================================================
app.listen(port);

console.log('Requests on port:' + port);

rank.start();

exports = module.exports = app;

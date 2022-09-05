'use strict';

const dotenv = require('dotenv');
const assert = require('assert');
const serviceAccountKey = require('./serviceAccountKey.json');

dotenv.config();

const { PORT, HOST, HOST_URL } = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

module.exports = {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  serviceAccountKey: serviceAccountKey,
};

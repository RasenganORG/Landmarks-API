'use strict';

import dotenv from 'dotenv';
import assert from 'assert';
import serviceAccountKey from './serviceAccountKey.js';

dotenv.config();

const { PORT, HOST, HOST_URL } = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

export default {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  serviceAccountKey: serviceAccountKey,
};

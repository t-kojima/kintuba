#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');
const { Validator } = require('jsonschema');

const FILE_PATH = '.kinmock.json';
const ENCODING = 'utf8';

const schema = {
  description: 'validation for kinmock config json',
  type: 'object',
  required: ['domain', 'username', 'password', 'app'],
  additionalProperties: false,
  properties: {
    domain: { type: 'string', pattern: '[a-zA-Z0-9-]+.cybozu.com' },
    username: { type: 'string' },
    password: { type: 'string' },
    app: {
      type: ['integer', 'array'],
      items: { type: 'integer' },
    },
  },
};

exports.init = async () => {
  const data = {
    domain: '<subdomain>.cybozu.com',
    app: 0,
    username: '',
    password: '',
  };

  const exists = async (path) => {
    const result = await promisify(fs.access)(path)
      .then(() => true)
      .catch((err) => {
        if (err.code === 'ENOENT') {
          return false;
        }
        throw err;
      });
    return result;
  };

  if (await exists(FILE_PATH)) {
    throw new Error(`${FILE_PATH} already exists.`);
  } else {
    await promisify(fs.writeFile)(FILE_PATH, JSON.stringify(data, null, '  '), {
      encoding: ENCODING,
    });
  }
};

exports.load = async () => {
  const readFile = async () => {
    const json = await promisify(fs.readFile)(FILE_PATH, ENCODING).catch(() => {
      throw new Error(`${FILE_PATH} can not read.`);
    });
    return JSON.parse(json);
  };

  const validate = (source) => {
    const result = new Validator().validate(source, schema);
    if (result.errors.length > 0) {
      throw new Error(`${FILE_PATH} is an invalid json schema. [${result.errors[0].message}]`);
    }
  };

  const config = await readFile();
  validate(config);
  return config;
};

#!/usr/bin/env node

const fs = require('fs');
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

exports.create = () => {
  const data = {
    domain: '<subdomain>.cybozu.com',
    app: 0,
    username: '',
    password: '',
  };

  const exists = (path) => {
    try {
      fs.accessSync(path);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      }
      throw err;
    }
  };

  if (exists(FILE_PATH)) {
    throw Error(`${FILE_PATH} already exists.`);
  } else {
    fs.writeFile(FILE_PATH, JSON.stringify(data, null, '  '), { encoding: ENCODING }, (err) => {
      if (err) throw err;
    });
  }
};

exports.load = () => {
  const readFile = () => {
    try {
      return JSON.parse(fs.readFileSync(FILE_PATH, ENCODING));
    } catch (err) {
      throw Error(`${FILE_PATH} can not read.`);
    }
  };

  const validate = (source) => {
    const result = new Validator().validate(source, schema);
    if (result.errors.length > 0) {
      throw Error(`${FILE_PATH} is an invalid json schema. [${result.errors[0].message}]`);
    }
  };

  const config = readFile();
  validate(config);
  return config;
};

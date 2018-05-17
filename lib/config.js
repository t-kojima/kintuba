const fs = require('fs');
const { Validator } = require('jsonschema');

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

const loadConfig = () => {
  const readFile = () => {
    try {
      return JSON.parse(fs.readFileSync('kinmock.json', 'utf8'));
    } catch (err) {
      throw Error('kinmock.jsonが読み込めませんでした。');
    }
  };

  const validate = (source) => {
    const result = new Validator().validate(source, schema);
    if (result.errors.length > 0) {
      throw Error(`kinmock.jsonの内容が不正です。[${result.errors[0].message}]`);
    }
  };

  const config = readFile();
  validate(config);
  return config;
};

exports.load = loadConfig;

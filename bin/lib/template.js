#!/usr/bin/env node

const fs = require('fs');
const { promisify } = require('util');

const ENCODING = 'utf8';

const createLogin = async () => {
  const FILE_PATH = '.kintuba/fixture/login.json';
  const data = {
    id: '',
    code: '',
    name: '',
    email: '',
    url: '',
    employeeNumber: '',
    phone: '',
    mobilePhone: '',
    extensionNumber: '',
    timezone: '',
    isGuest: false,
    language: '',
  };
  await promisify(fs.mkdir)('.kintuba').catch(() => {});
  await promisify(fs.mkdir)('.kintuba/fixture').catch(() => {});
  await promisify(fs.writeFile)(FILE_PATH, JSON.stringify(data, null, '  '), {
    encoding: ENCODING,
  });
  // eslint-disable-next-line no-console
  console.info(`Create template ${FILE_PATH}`);
};

const createRecords = async () => {
  const readFile = async () => {
    const FILE_PATH = '.kintuba/schema/fields.json';
    const json = await promisify(fs.readFile)(FILE_PATH, ENCODING).catch(() => {
      throw new Error(`${FILE_PATH} can not read.`);
    });
    return JSON.parse(json);
  };

  const saveFile = async (data) => {
    const FILE_PATH = '.kintuba/fixture/records.json';
    await promisify(fs.mkdir)('.kintuba').catch(() => {});
    await promisify(fs.mkdir)('.kintuba/fixture').catch(() => {});
    await promisify(fs.writeFile)(FILE_PATH, JSON.stringify(data, null, '  '), {
      encoding: ENCODING,
    });
    // eslint-disable-next-line no-console
    console.info(`Create template ${FILE_PATH}`);
  };

  const json = await readFile();
  const records = {
    $id: {
      type: '__ID__',
      value: '',
    },
    $revision: {
      type: '__REVISION__',
      value: '',
    },
  };
  Object.keys(json.properties)
    // enable = false はスキップ
    .filter((key) => {
      const prop = json.properties[key];
      return !('enabled' in prop) || prop.enabled;
    })
    .forEach((key) => {
      const prop = json.properties[key];
      records[key] = {
        type: prop.type,
        value: (() => {
          if (prop.type === 'CREATOR' || prop.type === 'MODIFIER') {
            return {
              code: '',
              name: '',
            };
          } else if ('defaultValue' in prop) {
            return prop.defaultValue;
          }
          return '';
        })(),
      };
    });
  await saveFile([records]);
};

exports.create = async () => {
  await createLogin();
  await createRecords();
};

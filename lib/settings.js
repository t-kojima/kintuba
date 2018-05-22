#!/usr/bin/env node

const fs = require('fs');

const DIR_SCHEMA = '.kinmock/schema';
const DIR_FIXTURE = '.kinmock/fixture';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults) => {
  try {
    // eslint-disable-next-line no-console
    console.info(`Load setting : ${filePath}`);
    return JSON.parse(fs.readFileSync(filePath, ENCODING));
  } catch (err) {
    return defaults;
  }
};

// アプリ情報
exports.app = (() =>
  loadFile(`${DIR_SCHEMA}/app.json`, {
    appId: '0',
    code: '',
    name: '',
    description: '',
    createdAt: '',
    creator: {
      code: '',
      name: '',
    },
    modifiedAt: '',
    modifier: {
      code: '',
      name: '',
    },
    spaceId: null,
    threadId: null,
  }))();

// ビューデータ
exports.views = (() => loadFile(`${DIR_SCHEMA}/views.json`, {}))();

// フィールドデータ
exports.fields = (() => loadFile(`${DIR_SCHEMA}/fields.json`, {}))();

// ログイン情報
exports.login = (() =>
  loadFile(`${DIR_FIXTURE}/login.json`, {
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
  }))();

// レコードデータ
exports.records = (() => loadFile(`${DIR_FIXTURE}/records.json`, []))();

exports.reset = () => {
  this.records = (() => loadFile(`${DIR_FIXTURE}/records.json`, []))();
};

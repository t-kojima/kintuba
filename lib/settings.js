#!/usr/bin/env node

const fs = require('fs');

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
  loadFile('.kinmock/app.json', {
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

// ログイン情報
exports.login = (() =>
  loadFile('.kinmock/login.json', {
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

// テストデータ
exports.records = (() => loadFile('.kinmock/records.json', []))();

// ビューデータ
exports.views = (() => loadFile('.kinmock/views.json', {}))();

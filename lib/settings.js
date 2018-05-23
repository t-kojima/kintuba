#!/usr/bin/env node

const fs = require('fs');

const DIR_SCHEMA = '.kinmock/schema';
const DIR_FIXTURE = '.kinmock/fixture';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, ENCODING));
  } catch (err) {
    return defaults;
  }
};

// アプリ情報
exports.app = (() => {
  // eslint-disable-next-line no-console
  console.info(`Load setting : ${DIR_SCHEMA}/app.json`);
  return loadFile(`${DIR_SCHEMA}/app.json`, {});
})();

// ビューデータ
exports.views = (() => {
  // eslint-disable-next-line no-console
  console.info(`Load setting : ${DIR_SCHEMA}/views.json`);
  return loadFile(`${DIR_SCHEMA}/views.json`, {});
})();

// フィールドデータ
exports.fields = (() => {
  // eslint-disable-next-line no-console
  console.info(`Load setting : ${DIR_SCHEMA}/fields.json`);
  return loadFile(`${DIR_SCHEMA}/fields.json`, {});
})();

// ログイン情報
exports.login = (() => {
  // eslint-disable-next-line no-console
  console.info(`Load setting : ${DIR_FIXTURE}/login.json`);
  return loadFile(`${DIR_FIXTURE}/login.json`, {});
})();

// レコードデータ
exports.records = (() => {
  // eslint-disable-next-line no-console
  console.info(`Load setting : ${DIR_FIXTURE}/records.json`);
  return loadFile(`${DIR_FIXTURE}/records.json`, []);
})();

exports.loadFixture = (dirname) => {
  this.login = loadFile(`${dirname}/login.json`, {});
  this.records = loadFile(`${dirname}/records.json`, []);
};

exports.loadDefault = () => {
  // eslint-disable-next-line no-console
  // console.info('reset to kintone settings');
  this.app = loadFile(`${DIR_SCHEMA}/app.json`, {});
  this.views = loadFile(`${DIR_SCHEMA}/views.json`, {});
  this.fields = loadFile(`${DIR_SCHEMA}/fields.json`, {});
  this.login = loadFile(`${DIR_FIXTURE}/login.json`, {});
  this.records = loadFile(`${DIR_FIXTURE}/records.json`, []);
};

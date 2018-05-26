#!/usr/bin/env node

const fs = require('fs');

const DIR_FIXTURE = '.kinmock/fixture';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, ENCODING));
  } catch (err) {
    return defaults;
  }
};

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

exports.loadFixture = (dirname = DIR_FIXTURE) => {
  this.login = loadFile(`${dirname}/login.json`, {});
  this.records = loadFile(`${dirname}/records.json`, []);
};

exports.update = (record) => {
  if (record) {
    this.delete(record.$id.value);
    this.records.push(record);
  }
};

exports.delete = (id) => {
  this.records = this.records.filter(r => r.$id.value !== id);
};

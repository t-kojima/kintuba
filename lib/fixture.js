#!/usr/bin/env node

/* eslint-disable no-console, no-param-reassign */

const fs = require('fs');

const DIR_FIXTURE = '.kintuba/fixture';
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
  console.info(`Load setting : ${DIR_FIXTURE}/login.json`);
  return loadFile(`${DIR_FIXTURE}/login.json`, {});
})();

// レコードデータ
exports.records = (() => {
  console.info(`Load setting : ${DIR_FIXTURE}/records.json`);
  return loadFile(`${DIR_FIXTURE}/records.json`, []);
})();

exports.loadFixture = (dirname = DIR_FIXTURE) => {
  this.login = loadFile(`${dirname}/login.json`, {});
  this.records = loadFile(`${dirname}/records.json`, []);
};

exports.find = (id) => {
  const record = this.records.find(r => r.$id.value === id);
  return record ? JSON.parse(JSON.stringify(record)) : null;
};

exports.register = (record) => {
  if (record) {
    const newId = Math.max(...this.records.map(a => a.$id.value)) + 1;
    record.$id.value = newId;
    this.records.push(JSON.parse(JSON.stringify(record)));
    return newId;
  }
  return null;
};

exports.update = (record) => {
  if (record) {
    this.delete(record.$id.value);
    this.records.push(JSON.parse(JSON.stringify(record)));
  }
};

exports.updateFieldById = (id, field, value) => {
  const record = this.records.find(r => r.$id.value === id);
  if (record) {
    record[field].value = value;
  }
};

exports.delete = (id) => {
  this.records = this.records.filter(r => r.$id.value !== id);
};

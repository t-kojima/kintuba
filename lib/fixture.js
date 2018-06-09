#!/usr/bin/env node

/* eslint-disable no-param-reassign */

const fs = require('fs');

const DIR_FIXTURE = '.kintuba/fixture';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults, shown = false) => {
  try {
    const json = JSON.parse(fs.readFileSync(filePath, ENCODING));
    if (shown) {
      // eslint-disable-next-line no-console
      console.info(`Load setting : ${filePath}`);
    }
    return json;
  } catch (err) {
    if (shown) {
      // eslint-disable-next-line no-console
      console.info(`Load default : ${filePath}`);
    }
    return defaults;
  }
};

// // ログイン情報
// exports.login = (() => loadFile(`${DIR_FIXTURE}/login.json`, {}, true))();

// // レコードデータ
// exports.records = (() => loadFile(`${DIR_FIXTURE}/records.json`, [], true))();

exports.login = {};

exports.records = [];

exports.load = (dirname = DIR_FIXTURE) => {
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
    record.$id.value = newId.toString();
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

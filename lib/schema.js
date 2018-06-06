#!/usr/bin/env node

const fs = require('fs');

const DIR_SCHEMA = '.kintuba/schema';
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

// フォームデータ
exports.form = (() => {
  // eslint-disable-next-line no-console
  console.info(`Load setting : ${DIR_SCHEMA}/form.json`);
  return loadFile(`${DIR_SCHEMA}/form.json`, {});
})();

exports.loadSchema = (dirname = DIR_SCHEMA) => {
  this.app = loadFile(`${dirname}/app.json`, {});
  this.views = loadFile(`${dirname}/views.json`, {});
  this.fields = loadFile(`${dirname}/fields.json`, {});
  this.form = loadFile(`${dirname}/form.json`, {});
};

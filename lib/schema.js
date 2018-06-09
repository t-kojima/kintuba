#!/usr/bin/env node

exports.app = {};

exports.views = {};

exports.fields = {};

exports.form = {};

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

// // アプリ情報
// exports.app = (() => loadFile(`${DIR_SCHEMA}/app.json`, {}, true))();

// // ビューデータ
// exports.views = (() => loadFile(`${DIR_SCHEMA}/views.json`, {}, true))();

// // フィールドデータ
// exports.fields = (() => loadFile(`${DIR_SCHEMA}/fields.json`, {}, true))();

// // フォームデータ
// exports.form = (() => loadFile(`${DIR_SCHEMA}/form.json`, {}, true))();

exports.load = (dirname = DIR_SCHEMA) => {
  this.app = loadFile(`${dirname}/app.json`, {});
  this.views = loadFile(`${dirname}/views.json`, {});
  this.fields = loadFile(`${dirname}/fields.json`, {});
  this.form = loadFile(`${dirname}/form.json`, {});
};

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

exports.app = {};

exports.views = {};

exports.fields = {};

exports.form = {};

exports.load = (dirname = DIR_SCHEMA) => {
  this.app = loadFile(`${dirname}/app.json`, {});
  this.views = loadFile(`${dirname}/views.json`, {});
  this.fields = loadFile(`${dirname}/fields.json`, {});
  this.form = loadFile(`${dirname}/form.json`, {});
};

#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this */

const Record = require('./app/record');
const schema = require('./schema');

module.exports = class App {
  constructor() {
    this.record = new Record();
  }

  getId() {
    return schema.app.appId;
  }

  getHeaderMenuSpaceElement() {
    return document.body;
  }

  getFieldElements() {
    return {};
  }

  getHeaderSpaceElement() {
    return {};
  }

  getLookupTargetAppId() {
    return {};
  }

  getQuery() {
    return {};
  }

  getQueryCondition() {
    return {};
  }

  getRelatedRecordsTargetAppId() {
    return {};
  }
};

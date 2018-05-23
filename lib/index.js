#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this */

const Event = require('./event');
const schema = require('./schema');
const fixture = require('./fixture');

const app = {
  getId: () => 1,
  getHeaderMenuSpaceElement: () => document.body,
  getFieldElements: () => {},
  getHeaderSpaceElement: () => {},
  getLookupTargetAppId: () => {},
  getQuery: () => {},
  getQueryCondition: () => {},
  getRelatedRecordsTargetAppId: () => {},
  record: () => {},
};

const api = {
  getConcurrencyLimit: () => {},
};

class Kinmock {
  constructor() {
    this.app = app;
    this.api = api;
    this.events = new Event(schema.fields);
  }

  loadSchema(dirname) {
    schema.loadSchema(dirname);
    this.events = new Event(schema.fields);
  }

  loadFixture(dirname) {
    fixture.loadFixture(dirname);
  }

  loadDefault() {
    this.loadSchema();
    this.loadFixture();
  }

  getLoginUser() {
    return fixture.login;
  }

  getUiVersion() {
    return 2;
  }
}

global.kintone = new Kinmock();

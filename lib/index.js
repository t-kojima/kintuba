/* eslint-disable no-undef, class-methods-use-this */

const settings = require('./settings');
const Event = require('./event');

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
    this.events = new Event(settings.fields);
  }

  loadSchema(dirname) {
    settings.loadSchema(dirname);
  }

  loadFixture(dirname) {
    settings.loadFixture(dirname);
    this.events = new Event(settings.fields);
  }

  loadDefault() {
    settings.loadDefault();
    this.events = new Event(settings.fields);
  }

  getLoginUser() {
    return settings.login;
  }

  getUiVersion() {
    return 2;
  }
}

global.kintone = new Kinmock();

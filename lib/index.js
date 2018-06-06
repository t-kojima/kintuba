#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this, no-param-reassign */

const App = require('./app');
const Record = require('./app/record');
const Event = require('./event');
const schema = require('./schema');
const fixture = require('./fixture');

const api = {
  getConcurrencyLimit: () => new Promise(resolve => resolve({ limit: 0, running: 0 })),
};

const onLocationChangedEvent = (events, app) => {
  // 外部に公開したくないパラメータを利用するメンバを動的に定義する。
  events.on('event.do', (type, options) => {
    app.getFieldElements = App.FieldElements(type);
    app.getHeaderSpaceElement = App.HeaderSpaceElement(type);
    app.getHeaderMenuSpaceElement = App.HeaderSpaceElement(type);
    app.getQuery = App.QueryCondition(type, options ? options.viewId : null);
    app.getQueryCondition = App.QueryCondition(type, options ? options.viewId : null);
  });
  events.on('event.type.changed', (event) => {
    app.record = event ? new Record(event.type, event.record) : new Record();
  });
};

class Kintuba {
  constructor() {
    this.app = new App();
    this.api = api;
    this.events = new Event(schema.fields);
    onLocationChangedEvent(this.events, this.app);
    this.Promise = Promise;
  }

  loadSchema(dirname) {
    schema.loadSchema(dirname);
    this.events = new Event(schema.fields);
    onLocationChangedEvent(this.events, this.app);
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

global.kintone = new Kintuba();

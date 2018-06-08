#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this, no-param-reassign */

const App = require('./app');
const Api = require('./api');
const Record = require('./app/record');
const Event = require('./event');
const schema = require('./schema');
const fixture = require('./fixture');

const onLocationChangedEvent = (events, app) => {
  // 外部に公開したくないパラメータを利用するメンバを動的に定義する。
  events.on('event.do', (type, options) => {
    app.getFieldElements = App.FieldElements(type);
    app.getHeaderSpaceElement = App.HeaderSpaceElement(type);
    app.getHeaderMenuSpaceElement = App.HeaderSpaceElement(type);
    app.getQuery = App.QueryCondition(type, options ? options.viewId : null);
    app.getQueryCondition = App.QueryCondition(type, options ? options.viewId : null);
  });
  events.on('event.type.changed', (type, record) => {
    app.record = new Record(type, record);
  });
};

class Kintuba {
  constructor() {
    this.app = new App();
    this.api = Api;
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

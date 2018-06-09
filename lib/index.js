#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this, no-param-reassign */

const App = require('./app');
const Api = require('./api');
const Record = require('./app/record');
const Event = require('./event');
const schema = require('./schema');
const fixture = require('./fixture');

class Kintuba {
  constructor() {
    this.app = new App();
    this.api = Api;
    this.events = new Event();
    this.Promise = Promise;

    // 外部に公開したくないパラメータを利用するメンバを動的に定義する。
    this.events.on('event.do', (type, options) => {
      this.app.getFieldElements = App.FieldElements(type);
      this.app.getHeaderSpaceElement = App.HeaderSpaceElement(type);
      this.app.getHeaderMenuSpaceElement = App.HeaderSpaceElement(type);
      this.app.getQuery = App.QueryCondition(type, options ? options.viewId : null);
      this.app.getQueryCondition = App.QueryCondition(type, options ? options.viewId : null);
    });
    this.events.on('event.type.changed', (type, record) => {
      this.app.record = new Record(type, record);
    });

    this.schema = {
      app: {
        set: (contents) => {
          schema.app = JSON.parse(contents);
        },
      },
      fields: {
        set: (contents) => {
          schema.fields = JSON.parse(contents);
        },
      },
      form: {
        set: (contents) => {
          schema.form = JSON.parse(contents);
        },
      },
      views: {
        set: (contents) => {
          schema.views = JSON.parse(contents);
        },
      },
    };
    this.fixture = {
      login: {
        set: (contents) => {
          fixture.login = JSON.parse(contents);
        },
      },
      records: {
        set: (contents) => {
          fixture.records = JSON.parse(contents);
        },
      },
    };
  }

  getLoginUser() {
    return fixture.login;
  }

  getUiVersion() {
    return 2;
  }
}

global.kintone = new Kintuba();

/* eslint-disable no-undef, class-methods-use-this, no-param-reassign */

const App = require('./app');
const Api = require('./api');
const Record = require('./app/record');
const Plugin = require('./plugin');
const Proxy = require('./proxy');
const Event = require('./event');
const schema = require('./schema');
const fixture = require('./fixture');

const parse = (value, defaultValue = {}) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
};

class Kintuba {
  constructor() {
    this.app = new App();
    this.api = Api;
    this.plugin = Plugin;
    this.proxy = Proxy;
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
          schema.app = parse(contents);
        },
      },
      fields: {
        set: (contents) => {
          schema.fields = parse(contents);
        },
      },
      form: {
        set: (contents) => {
          schema.form = parse(contents);
        },
      },
      views: {
        set: (contents) => {
          schema.views = parse(contents);
        },
      },
    };
    this.schema.load = dirname => schema.load(dirname);
    this.fixture = {
      login: {
        set: (contents) => {
          fixture.login = parse(contents);
        },
      },
      records: {
        set: (contents) => {
          fixture.records = parse(contents, []);
        },
      },
    };
    this.fixture.load = dirname => fixture.load(dirname);
  }

  getLoginUser() {
    return fixture.login;
  }

  getUiVersion() {
    return 2;
  }
}

global.kintone = new Kintuba();

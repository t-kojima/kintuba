#!/usr/bin/env node

const { EventEmitter } = require('events');
const schema = require('./schema');
const fixture = require('./fixture');

const DEFAULT_VIEW_ID = '20';

class EventObject {
  constructor(event) {
    this.appId = schema.app.appId;
    this.type = event;
  }
}

class RecordEventObject extends EventObject {
  constructor(event, options = { recordId: '1' }) {
    super(event);

    const record = fixture.records.find(a => a.$id.value === options.recordId);
    this.recordId = record ? record.$id.value : '0';
    this.record = record || {};
  }
}

class RecordDeleteEventObject extends RecordEventObject {
  constructor(event, options = { recordId: '1' }) {
    super(event, options);
  }

  done() {
    if (this.recordId !== '0') {
      fixture.records = fixture.records.filter(r => r.$id.value !== this.record.$id.value);
    }
  }
}

class RecordChangeEventObject extends RecordEventObject {
  constructor(event, options = { recordId: '1' }, type) {
    super(event, options);

    this.changes = {
      field: {
        type,
        value: 'value' in options ? options.value : '',
      },
      row: {},
    };
  }
}

class RecordsEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    this.date = null;
    this.offset = 0;

    const { views } = schema.views;
    const view = views
      ? Object.keys(views)
        .map(key => views[key])
        .find(item => item.id === options.viewId)
      : null;
    this.viewId = view ? view.id : DEFAULT_VIEW_ID;
    this.viewName = view ? view.name : '（すべて）';
    this.viewType = view ? view.type.toLowerCase() : 'list';

    this.size = fixture.records.length;
    this.records = fixture.records;
  }
}

module.exports = class Event extends EventEmitter {
  constructor(fields) {
    super();
    this.app = {
      record: {
        index: {
          show: (event, options) => new RecordsEventObject(event, options),
          edit: {
            show: (event, options) => new RecordEventObject(event, options),
            submit: (event, options) => new RecordEventObject(event, options),
            change: {},
          },
          delete: {
            submit: (event, options) => new RecordDeleteEventObject(event, options),
          },
        },
      },
      report: {
        show: () => {},
      },
    };

    // 関数に関数を定義する
    this.app.record.index.edit.submit.success = (event, options) =>
      new RecordEventObject(event, options);

    // fields項目の関数を定義する
    if (fields.properties) {
      Object.keys(fields.properties).forEach((key) => {
        const prop = fields.properties[key];
        this.app.record.index.edit.change[key] = (event, options) =>
          new RecordChangeEventObject(event, options, prop.type);
      });
    }
  }

  emit(event, ...args) {
    const promises = [];
    this.listeners(event).forEach((listener) => {
      promises.push(listener(...args));
    });
    return Promise.all(promises);
  }

  async do(event, options) {
    global.kintone.location = event;
    if (
      event.match(/^app\.(record|report)(\.(index|detail))?(\.(create|edit|delete|print))?(\.(show|change|submit|process))?(\.(success|proceed))?(\..+)?$/)
    ) {
      // eslint-disable-next-line no-eval
      const func = eval(`this.${event}`);
      if (typeof func === 'function') {
        // 複数ハンドラ登録されていた場合、最後のみ反映させる為popする
        const resolve = (await this.emit(event, func(event, options))).pop();
        if (resolve && resolve.done) {
          resolve.done();
        }
        return resolve;
      }
      // eslint-disable-next-line no-console
      console.warn(`\nmissing event : ${event}`);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`\nno match event : ${event}`);
    }
    return null;
  }

  off(event) {
    this.removeAllListeners(event);
  }
};

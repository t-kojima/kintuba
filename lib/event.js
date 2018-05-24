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
    if (record) {
      this.recordId = record.$id.value;
      this.record = record;
    }
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

/* eslint-disable no-param-reassign */

class RecordsEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    const { views } = schema.views;
    const view = views
      ? Object.keys(views)
        .map(key => views[key])
        .find(item => item.id === options.viewId)
      : null;
    this.viewId = view ? view.id : DEFAULT_VIEW_ID;
    this.viewName = view ? view.name : '（すべて）';
    this.viewType = view ? view.type.toLowerCase() : 'list';

    const isCalendar = () => this.viewType === 'calendar';

    this.date = (() => {
      if (!isCalendar()) return null;
      if (options.date) return options.date;
      throw new Error('date option is required when selected calendar');
    })();
    this.offset = (() => {
      if (isCalendar()) return null;
      return options.offset ? options.offset : 0;
    })();
    this.records = (() => {
      if (isCalendar()) {
        return (
          fixture.records
            .filter(r => r[view.date].value && r[view.date].value.startsWith(this.date))
            // [...record] から { date: [...record],} へ変換
            .reduce((prev, cur) => {
              if (cur[view.date].value) {
                const date = cur[view.date].value.slice(0, 10);
                if (!prev[date]) prev[date] = [];
                prev[date].push(cur);
              }
              return prev;
            }, {})
        );
      }
      const limit = options.limit ? options.limit : 100;
      // record.skip(offset).take(limit)...って書きたい
      // TODO viewのfilterとsort条件の実装
      return fixture.records.slice(this.offset).slice(0, limit);
    })();
    this.size = isCalendar() ? null : this.records.length;
  }
}

// kintone.eventsからアクセスできないようにEventクラス外へ配置
const app = {
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
    detail: {
      show: (event, options) => new RecordEventObject(event, options),
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
app.record.index.edit.submit.success = (event, options) => new RecordEventObject(event, options);

// fields項目の関数を定義する
const setFieldsProperties = (fields) => {
  if (fields.properties) {
    Object.keys(fields.properties).forEach((key) => {
      const prop = fields.properties[key];
      app.record.index.edit.change[key] = (event, options) =>
        new RecordChangeEventObject(event, options, prop.type);
    });
  } else {
    app.record.index.edit.change = {};
  }
};

module.exports = class Event extends EventEmitter {
  constructor(fields) {
    super();
    setFieldsProperties(fields);
  }

  emit(event, ...args) {
    const promises = [];
    this.listeners(event).forEach((listener) => {
      promises.push(listener(...args));
    });
    return Promise.all(promises);
  }

  async do(event, options) {
    if (
      event.match(/^app\.(record|report)(\.(index|detail))?(\.(create|edit|delete|print))?(\.(show|change|submit|process))?(\.(success|proceed))?(\..+)?$/)
    ) {
      // eslint-disable-next-line no-eval
      const func = eval(`${event}`);
      if (typeof func === 'function') {
        // 複数ハンドラ登録されていた場合、最後のみ反映させる為popする
        const resolve = (await this.emit(event, func(event, options))).pop();
        // app.record等へ変更を通知
        await this.emit('event.type.changed', resolve);
        if (resolve && resolve.done) resolve.done();
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

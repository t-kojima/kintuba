#!/usr/bin/env node

const { EventEmitter } = require('events');

const RecordEventObject = require('./record_event_object');
const RecordEditEventObject = require('./record_edit_event_object');
const RecordEditSubmitEventObject = require('./record_edit_submit_event_object');
const RecordEditSubmitSuccessEventObject = require('./record_edit_submit_success_event_object');
const RecordDeleteEventObject = require('./record_delete_event_object');
const RecordChangeEventObject = require('./record_change_event_object');
const RecordProcessEventObject = require('./record_process_event_object');
const RecordsEventObject = require('./records_event_object');
const ReportEventObject = require('./report_event_object');

// kintone.eventsからアクセスできないようにEventクラス外へ配置
const app = {
  record: {
    index: {
      show: (event, options) => new RecordsEventObject(event, options),
      edit: {
        show: (event, options) => new RecordEventObject(event, options),
        submit: (event, options) => new RecordEditSubmitEventObject(event, options),
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
      process: {
        proceed: (event, options) => new RecordProcessEventObject(event, options),
      },
    },
    create: {
      show: (event, options) => new RecordEditEventObject(event, options),
      submit: (event, options) => new RecordEditSubmitEventObject(event, options),
      change: {},
    },
    edit: {
      show: (event, options) => new RecordEditEventObject(event, options),
      submit: (event, options) => new RecordEditSubmitEventObject(event, options),
      change: {},
    },
    print: {
      show: (event, options) => new RecordEventObject(event, options),
    },
  },
  report: {
    show: (event, options) => new ReportEventObject(event, options),
  },
};

// 関数に関数を定義する
app.record.index.edit.submit.success = (event, options) =>
  new RecordEditSubmitSuccessEventObject(event, options);
app.record.create.submit.success = (event, options) =>
  new RecordEditSubmitSuccessEventObject(event, options);
app.record.edit.submit.success = (event, options) =>
  new RecordEditSubmitSuccessEventObject(event, options);

// fields項目の関数を定義する
const setFieldsProperties = (fields) => {
  if (fields.properties) {
    Object.keys(fields.properties)
      .filter(key =>
        RecordChangeEventObject.TYPES.some(type => type === fields.properties[key].type))
      .forEach((key) => {
        const prop = fields.properties[key];
        app.record.index.edit.change[key] = (event, options) =>
          new RecordChangeEventObject(event, options, prop.type, true);
        app.record.create.change[key] = (event, options) =>
          new RecordChangeEventObject(event, options, prop.type, true);
        app.record.edit.change[key] = (event, options) =>
          new RecordChangeEventObject(event, options, prop.type, false);
      });
  } else {
    app.record.index.edit.change = {};
  }
};

const validate = (event) => {
  if (
    !event.match(/^app\.(record|report)(\.(index|detail))?(\.(create|edit|delete|print))?(\.(show|change|submit|process))?(\.(success|proceed))?(\..+)?$/)
  ) {
    // eslint-disable-next-line no-console
    console.warn(`\nno match event : ${event}`);
    return false;
  }

  // eslint-disable-next-line no-eval
  if (typeof eval(`${event}`) !== 'function') {
    // eslint-disable-next-line no-console
    console.warn(`\nmissing event : ${event}`);
    return false;
  }
  return true;
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
    if (!validate(event)) return null;

    // eslint-disable-next-line no-eval
    const eventObj = eval(`${event}`)(event, options);
    // kintone.appへ変更を通知
    await this.emit('event.do', event, options);
    await this.emit('event.type.changed', event, eventObj.record);
    // 複数ハンドラ登録されていた場合、最後のみ反映させる為popする
    const resolve = (await this.emit(event, eventObj)).pop();

    if (resolve && resolve.done) resolve.done();
    if (eventObj.cancel) eventObj.cancel(resolve);

    return resolve;
  }

  off(event) {
    if (event) {
      this.removeAllListeners(event);
    } else {
      this.removeAllListeners();
    }
  }
};

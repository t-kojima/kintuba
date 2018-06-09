(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


const RecordApi = require('./record_api');

const api = (pathOrUrl, method, params, callback, errback) => {
  const apiobj = (() => {
    if (pathOrUrl === '/k/v1/record') {
      return new RecordApi(params);
    }
    return null;
  })();

  const done = (cb, eb) => {
    if (apiobj) {
      return apiobj.do(method, cb, eb);
    }
    return eb({ message: 'Invalid pathOrUrl' });
  };

  return callback && errback
    ? done(callback, errback)
    : new Promise((resolve, reject) => done(resolve, reject));
};

api.url = (path, detectGuestSpace = false) =>
  (detectGuestSpace
    ? `https://dummy.cybozu.com/k/guest/1${path.replace(/\/k/, '')}.json`
    : `https://dummy.cybozu.com${path}.json`);

api.urlForGet = (path, params, detectGuestSpace = false) => {
  const getQuery = obj =>
    Object.keys(obj).reduce((result, key) => {
      if (Array.isArray(obj[key])) {
        result.push(...obj[key].map((a, i) => `${key}[${i}]=${a}`));
      } else if (obj[key] instanceof Object) {
        result.push(getQuery(obj[key]).map(a => `${key}.${a}`));
      } else {
        result.push(`${key}=${obj[key].toString()}`);
      }
      return result;
    }, []);
  const query = getQuery(params)
    .toString()
    .replace(/,/g, '&');
  return detectGuestSpace
    ? `https://dummy.cybozu.com/k/guest/1${path.replace(/\/k/, '')}.json?${query}`
    : `https://dummy.cybozu.com${path}.json?${query}`;
};

api.getConcurrencyLimit = () => new Promise(resolve => resolve({ limit: 0, running: 0 }));

module.exports = api;

},{"./record_api":2}],2:[function(require,module,exports){


const schema = require('./../schema');
const fixture = require('./../fixture');

module.exports = class RecordApi {
  constructor(params) {
    this.params = params;
  }

  do(method, callback, errback) {
    if (method === 'GET') {
      this.get(callback, errback);
    } else if (method === 'POST') {
      this.post(callback, errback);
    } else if (method === 'PUT') {
      this.put(callback, errback);
    } else {
      errback({ message: `Invalid method [${method}]` });
    }
  }

  get(callback, errback) {
    const validate = () =>
      this.params.app &&
      this.params.app.toString() === schema.app.appId &&
      this.params.id &&
      Number(this.params.id);

    if (validate()) {
      const record = fixture.find(this.params.id.toString());
      if (record) {
        callback({ record });
        return;
      }
    }
    errback({ message: 'Invalid params' });
  }

  post(callback, errback) {
    const validate = () =>
      this.params.app && this.params.app.toString() === schema.app.appId && this.params.record;

    if (validate()) {
      this.params.record.$id = {
        type: '__ID__',
        value: '',
      };
      this.params.record.$revision = {
        type: '__REVISION__',
        value: '',
      };

      Object.keys(schema.fields.properties)
        // enable = false はスキップ
        .filter((key) => {
          const prop = schema.fields.properties[key];
          return !('enabled' in prop) || prop.enabled;
        })
        .forEach((key) => {
          if (!(key in this.params.record)) {
            const prop = schema.fields.properties[key];
            this.params.record[key] = {
              type: prop.type,
              value: (() => {
                if (prop.type === 'CREATOR' || prop.type === 'MODIFIER') {
                  return {
                    code: '',
                    name: '',
                  };
                } else if ('defaultValue' in prop) {
                  return prop.defaultValue;
                }
                return '';
              })(),
            };
          }
        });
      const newId = fixture.register(this.params.record);
      callback({
        id: newId.toString(),
        revision: '1',
      });
      return;
    }
    errback({ message: 'Invalid params' });
  }
};

},{"./../fixture":16,"./../schema":18}],3:[function(require,module,exports){


/* eslint-disable no-undef, class-methods-use-this */

const Record = require('./../app/record');
const schema = require('./../schema');
const fixture = require('./../fixture');

const exists = (fn) => {
  try {
    return fn() !== undefined;
  } catch (e) {
    return false;
  }
};

module.exports = class App {
  constructor() {
    this.record = new Record();
  }

  getId() {
    return schema.app.appId || null;
  }

  getFieldElements() {
    // lib/index.jsでFieldElementsを呼び出して、動的にこのメソッドを定義する。
  }

  static FieldElements(type) {
    const allows = ['app.record.index'];
    const isAllow = () => allows.some(a => type.startsWith(a));
    // eslint-disable-next-line no-unused-vars
    if (!isAllow() || !schema.fields.properties) return fieldCode => null;
    // eslint-disable-next-line no-unused-vars
    if (fixture.records.length === 0) return fieldCode => [];
    return fieldCode =>
      (schema.fields.properties[fieldCode] ? document.createElement('div') : null);
  }

  getHeaderSpaceElement() {
    // lib/index.jsでHeaderSpaceElementを呼び出して、動的にこのメソッドを定義する。
  }

  getHeaderMenuSpaceElement() {
    // lib/index.jsでHeaderSpaceElementを呼び出して、動的にこのメソッドを定義する。
  }

  static HeaderSpaceElement(type) {
    const allows = ['app.record.index'];
    const isAllow = () => allows.some(a => type.startsWith(a));
    if (!isAllow()) return () => null;
    return () => document.body;
  }

  getLookupTargetAppId(fieldCode) {
    if (exists(() => schema.fields.properties[fieldCode].lookup.relatedApp.app)) {
      return schema.fields.properties[fieldCode].lookup.relatedApp.app;
    }
    return null;
  }

  getRelatedRecordsTargetAppId(fieldCode) {
    if (exists(() => schema.fields.properties[fieldCode].referenceTable.relatedApp.app)) {
      return schema.fields.properties[fieldCode].referenceTable.relatedApp.app;
    }
    return null;
  }

  getQuery() {
    // lib/index.jsでQueryConditionを呼び出して、動的にこのメソッドを定義する。
  }

  getQueryCondition() {
    // lib/index.jsでQueryConditionを呼び出して、動的にこのメソッドを定義する。
    // typeやviewIdなど、Appクラスのプロパティとして公開したくない為
  }

  static QueryCondition(type, viewId) {
    const allows = ['app.record.index', 'app.report'];
    const isAllow = () => allows.some(a => type.startsWith(a));
    if (!isAllow()) {
      return () => null;
    }
    const { views } = schema.views;
    const view = views
      ? Object.keys(views)
        .map(key => views[key])
        .find(item => item.id === viewId)
      : null;
    return () => (view ? view.filterCond : '');
  }
};

},{"./../app/record":4,"./../fixture":16,"./../schema":18}],4:[function(require,module,exports){


/* eslint-disable no-undef, class-methods-use-this, no-unused-vars */

const schema = require('./../schema');

module.exports = class Record {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  getId() {
    const allows = ['app.record.detail', 'app.record.edit', 'app.record.print'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    return this.data && isAllow() ? this.data.$id.value : null;
  }

  get() {
    const allows = [
      'app.record.detail',
      'app.record.create',
      'app.record.edit',
      'app.record.print',
    ];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    return this.data && isAllow() ? JSON.parse(JSON.stringify({ record: this.data })) : null;
  }

  set(data) {
    const allows = ['app.record.create', 'app.record.edit'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow()) {
      this.data = JSON.parse(JSON.stringify(data.record));
    }
  }

  setFieldShown(fieldCode, isShown) {
    // 何もしない
  }

  setGroupFieldOpen(fieldCode, isOpen) {
    // 何もしない
  }

  getFieldElement(fieldCode) {
    const allows = ['app.record.detail', 'app.record.print'];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow() && schema.fields.properties) {
      if (schema.fields.properties[fieldCode]) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        return div; // 空divを返す
      }
    }
    return null;
  }

  getHeaderMenuSpaceElement() {
    return document.body; // bodyを返す
  }

  getSpaceElement(id) {
    const allows = [
      'app.record.detail',
      'app.record.create',
      'app.record.edit',
      'app.record.print',
    ];
    const isAllow = () => allows.some(a => this.type.startsWith(a));
    if (isAllow() && schema.form.properties) {
      const target = Object.keys(schema.form.properties).find((key) => {
        const prop = schema.form.properties[key];
        return prop.type === 'SPACER' && prop.elementId === id;
      });
      if (target) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        return div; // 空divを返す
      }
    }
    return null;
  }
};

},{"./../schema":18}],5:[function(require,module,exports){


const schema = require('./../schema');

module.exports = class EventObject {
  constructor(event) {
    this.appId = schema.app.appId;
    this.type = event;
  }
};

},{"./../schema":18}],6:[function(require,module,exports){


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

const schema = require('../schema');

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
const appendFieldChangeEvent = (event) => {
  const match = event.match(/^(app\.record\.(index\.edit|edit|create)\.change)\.([^.]+)$/);
  if (!match) return;
  const key = match[3];
  if (!schema.fields.properties || !schema.fields.properties[key]) return;
  const { type } = schema.fields.properties[key];
  if (!RecordChangeEventObject.TYPES.some(t => t === type)) return;

  // eslint-disable-next-line no-eval
  eval(`${match[1]}`)[key] = (ev, options) =>
    // match[2]=editの場合のみ、トリガの変更がキャンセルされる可能性がある
    new RecordChangeEventObject(ev, options, type, match[2] !== 'edit');
};

const removeFieldChangeEvent = (event) => {
  if (event) {
    const match = event.match(/^(app\.record\.(index\.edit|edit|create)\.change)\.([^.]+)$/);
    if (!match) return;
    const key = match[3];
    // eslint-disable-next-line no-eval
    if (typeof eval(`${event}`) === 'function') {
      // eslint-disable-next-line no-eval
      eval(`${match[1]}`)[key] = {};
    }
  } else {
    app.record.index.edit.change = {};
    app.record.edit.change = {};
    app.record.create.change = {};
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
  emit(event, ...args) {
    const promises = [];
    this.listeners(event).forEach((listener) => {
      promises.push(listener(...args));
    });
    return Promise.all(promises);
  }

  async do(event, options) {
    appendFieldChangeEvent(event);
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
    removeFieldChangeEvent(event);
  }
};

},{"../schema":18,"./record_change_event_object":7,"./record_delete_event_object":8,"./record_edit_event_object":9,"./record_edit_submit_event_object":10,"./record_edit_submit_success_event_object":11,"./record_event_object":12,"./record_process_event_object":13,"./records_event_object":14,"./report_event_object":15,"events":20}],7:[function(require,module,exports){


// record.index.edit.change.<field>
// record.edit.change.<field>
// record.create.change.<field>

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

const getKey = (type) => {
  const keys = type.split('.');
  return keys[keys.length - 1];
};

module.exports = class RecordChangeEventObject extends RecordEventObject {
  constructor(event, options = {}, type, triggerNotCancel) {
    super(event, options);

    if (options.value === undefined) throw new Error('value option is required.');

    this.changes = {
      field: {
        type,
        value: options.value,
      },
      row: {},
    };

    if (triggerNotCancel) {
      this.record[getKey(this.type)].value = options.value;
      this.rollbackDisallowFields();
      fixture.update(this.record);
    }
  }

  done() {
    this.record[getKey(this.type)].value = this.changes.field.value;
    this.rollbackDisallowFields();
    fixture.update(this.record);
  }

  static get TYPES() {
    return [
      'RADIO_BUTTON',
      'DROP_DOWN',
      'CHECK_BOX',
      'MULTI_SELECT',
      'USER_SELECT',
      'ORGANIZATION_SELECT',
      'GROUP_SELECT',
      'DATE',
      'TIME',
      'DATETIME',
      'SINGLE_LINE_TEXT',
      'NUMBER',
      'SUBTABLE',
    ];
  }
};

},{"./../fixture":16,"./record_event_object":12}],8:[function(require,module,exports){


// app.record.detail.delete.submit
// app.record.index.delete.submit

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordDeleteEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
  }

  done() {
    fixture.delete(this.recordId);
  }
};

},{"./../fixture":16,"./record_event_object":12}],9:[function(require,module,exports){


// app.record.create.show
// app.record.edit.show

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordEditEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
    this.reuse = false;
  }

  done() {
    this.rollbackDisallowFields();
    fixture.update(this.record);
  }
};

},{"./../fixture":16,"./record_event_object":12}],10:[function(require,module,exports){


// record.index.edit.submit
// record.create.submit
// record.edit.submit

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordEditSubmitEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
  }

  done() {
    this.rollbackDisallowFields();
    fixture.update(this.record);
  }
};

},{"./../fixture":16,"./record_event_object":12}],11:[function(require,module,exports){


// record.index.edit.submit.success
// record.create.submit.success
// record.edit.submit.success

const RecordEventObject = require('./record_event_object');

module.exports = class RecordEditSubmitSuccessEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
    this.url = null;
  }
};

},{"./record_event_object":12}],12:[function(require,module,exports){


// app.record.index.edit.show
// app.record.detail.show
// app.record.print.show

const schema = require('./../schema');
const fixture = require('./../fixture');
const EventObject = require('./event_object');

module.exports = class RecordEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    if (!options.recordId) throw new Error('recordId option is required.');

    const copy = fixture.find(options.recordId.toString());
    if (copy) {
      const record = JSON.parse(JSON.stringify(copy));
      this.recordId = record.$id.value;
      this.record = record;
    }
  }

  rollbackDisallowFields() {
    const EDIT_DISALLOWS = [
      'RECORD_NUMBER',
      'CREATOR',
      'CREATED_TIME',
      'MODIFIER',
      'UPDATED_TIME',
      'STATUS',
      'STATUS_ASSIGNEE',
      'CALC',
      'FILE',
    ];

    const isDisallows = key => EDIT_DISALLOWS.some(a => a === schema.fields.properties[key].type);

    const isAutoCalc = key =>
      schema.fields.properties[key].type === 'SINGLE_LINE_TEXT' &&
      schema.fields.properties[key].expression;

    const isLookup = key =>
      (schema.fields.properties[key].type === 'SINGLE_LINE_TEXT' ||
        schema.fields.properties[key].type === 'NUMBER') &&
      schema.fields.properties[key].lookup;

    const isLookupMapping = (key) => {
      const mappings = Object.keys(schema.fields.properties)
        .filter(k =>
          schema.fields.properties[k].lookup && schema.fields.properties[k].lookup.fieldMappings)
        .map(k => schema.fields.properties[k].lookup.fieldMappings);
      return mappings.some(a => a.some(b => b.field === key));
    };

    const hasSchema = key =>
      (schema.fields.properties ? Object.keys(schema.fields.properties).some(a => a === key) : false);

    if (this.record) {
      Object.keys(this.record)
        .filter(key => hasSchema(key))
        .forEach((key) => {
          // 編集非許可のフィールド or 文字列かつ自動計算 or ルックアップ or ルックアップコピー先 は編集不可
          if (isDisallows(key) || isAutoCalc(key) || isLookup(key) || isLookupMapping(key)) {
            this.record[key].value = fixture.find(this.recordId)[key].value;
          }
          // ラジオボタンフィールドで空文字列を指定した場合、初期値の選択肢になる
          if (
            schema.fields.properties[key].type === 'RADIO_BUTTON' &&
            this.record[key].value === ''
          ) {
            this.record[key].value = schema.fields.properties[key].defaultValue;
          }
        });
    }
  }
};

},{"./../fixture":16,"./../schema":18,"./event_object":5}],13:[function(require,module,exports){


const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordProcessEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);

    if (options.action === undefined) throw new Error('action option is required.');
    if (options.status === undefined) throw new Error('status option is required.');
    if (options.nextStatus === undefined) throw new Error('nextStatus option is required.');

    this.action = { value: options.action };
    this.status = { value: options.status };
    this.nextStatus = { value: options.nextStatus };
    this.error = null;

    this.record.ステータス.value = this.nextStatus.value;
    fixture.update(this.record);
  }

  done() {
    if (!this.error) {
      this.rollbackDisallowFields();
      fixture.update(this.record);
    }
  }

  cancel(resolve) {
    if (resolve === undefined) return;
    if (!resolve.error && resolve instanceof RecordProcessEventObject) return;

    // ステータスを元に戻す、ステータス以外の項目はそもそもupdate掛かっていないので戻さなくてOK
    fixture.updateFieldById(this.recordId, 'ステータス', this.status.value);
  }
};

},{"./../fixture":16,"./record_event_object":12}],14:[function(require,module,exports){


const fixture = require('./../fixture');
const schema = require('./../schema');
const EventObject = require('./event_object');

const DEFAULT_VIEW_ID = '20';

/* eslint-disable no-param-reassign */

const calendarRecords = (keyColumn, yyyymm) =>
  JSON.parse(JSON.stringify(fixture.records))
    .filter(r => r[keyColumn].value && r[keyColumn].value.startsWith(yyyymm))
    // [...record] から { date: [...record],} へ変換
    .reduce((prev, cur) => {
      if (cur[keyColumn].value) {
        const date = cur[keyColumn].value.slice(0, 10);
        if (!prev[date]) prev[date] = [];
        prev[date].push(cur);
      }
      return prev;
    }, {});

module.exports = class RecordsEventObject extends EventObject {
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
        return calendarRecords(view.date, this.date);
      }
      const limit = options.limit ? options.limit : 100;
      // record.skip(offset).take(limit)...って書きたい
      // TODO viewのfilterとsort条件の実装
      return JSON.parse(JSON.stringify(fixture.records))
        .slice(this.offset)
        .slice(0, limit);
    })();
    this.size = isCalendar() ? null : this.records.length;
  }
};

},{"./../fixture":16,"./../schema":18,"./event_object":5}],15:[function(require,module,exports){


// app.report.show

const EventObject = require('./event_object');

module.exports = class ReportEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event, options);
  }
};

},{"./event_object":5}],16:[function(require,module,exports){


/* eslint-disable no-param-reassign */

const fs = require('fs');

const DIR_FIXTURE = '.kintuba/fixture';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults, shown = false) => {
  try {
    const json = JSON.parse(fs.readFileSync(filePath, ENCODING));
    if (shown) {
      // eslint-disable-next-line no-console
      console.info(`Load setting : ${filePath}`);
    }
    return json;
  } catch (err) {
    if (shown) {
      // eslint-disable-next-line no-console
      console.info(`Load default : ${filePath}`);
    }
    return defaults;
  }
};

// // ログイン情報
// exports.login = (() => loadFile(`${DIR_FIXTURE}/login.json`, {}, true))();

// // レコードデータ
// exports.records = (() => loadFile(`${DIR_FIXTURE}/records.json`, [], true))();

exports.login = {};

exports.records = [];

exports.load = (dirname = DIR_FIXTURE) => {
  this.login = loadFile(`${dirname}/login.json`, {});
  this.records = loadFile(`${dirname}/records.json`, []);
};

exports.find = (id) => {
  const record = this.records.find(r => r.$id.value === id);
  return record ? JSON.parse(JSON.stringify(record)) : null;
};

exports.register = (record) => {
  if (record) {
    const newId = Math.max(...this.records.map(a => a.$id.value)) + 1;
    record.$id.value = newId.toString();
    this.records.push(JSON.parse(JSON.stringify(record)));
    return newId;
  }
  return null;
};

exports.update = (record) => {
  if (record) {
    this.delete(record.$id.value);
    this.records.push(JSON.parse(JSON.stringify(record)));
  }
};

exports.updateFieldById = (id, field, value) => {
  const record = this.records.find(r => r.$id.value === id);
  if (record) {
    record[field].value = value;
  }
};

exports.delete = (id) => {
  this.records = this.records.filter(r => r.$id.value !== id);
};

},{"fs":19}],17:[function(require,module,exports){
(function (global){


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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./api":1,"./app":3,"./app/record":4,"./event":6,"./fixture":16,"./schema":18}],18:[function(require,module,exports){


exports.app = {};

exports.views = {};

exports.fields = {};

exports.form = {};

const fs = require('fs');

const DIR_SCHEMA = '.kintuba/schema';
const ENCODING = 'utf8';

const loadFile = (filePath, defaults) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, ENCODING));
  } catch (err) {
    return defaults;
  }
};

// // アプリ情報
// exports.app = (() => loadFile(`${DIR_SCHEMA}/app.json`, {}, true))();

// // ビューデータ
// exports.views = (() => loadFile(`${DIR_SCHEMA}/views.json`, {}, true))();

// // フィールドデータ
// exports.fields = (() => loadFile(`${DIR_SCHEMA}/fields.json`, {}, true))();

// // フォームデータ
// exports.form = (() => loadFile(`${DIR_SCHEMA}/form.json`, {}, true))();

exports.load = (dirname = DIR_SCHEMA) => {
  this.app = loadFile(`${dirname}/app.json`, {});
  this.views = loadFile(`${dirname}/views.json`, {});
  this.fields = loadFile(`${dirname}/fields.json`, {});
  this.form = loadFile(`${dirname}/form.json`, {});
};

},{"fs":19}],19:[function(require,module,exports){

},{}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}]},{},[17]);

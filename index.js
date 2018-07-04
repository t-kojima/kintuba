/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/api/index.js":
/*!**************************!*\
  !*** ./lib/api/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const RecordApi = __webpack_require__(/*! ./record_api */ \"./lib/api/record_api.js\");\n\nconst api = (pathOrUrl, method, params, callback, errback) => {\n  const apiobj = (() => {\n    if (pathOrUrl === '/k/v1/record') {\n      return new RecordApi(params);\n    }\n    return null;\n  })();\n\n  const done = (cb, eb) => {\n    if (apiobj) {\n      return apiobj.do(method, cb, eb);\n    }\n    return eb({ message: 'Invalid pathOrUrl' });\n  };\n\n  return callback && errback\n    ? done(callback, errback)\n    : new Promise((resolve, reject) => done(resolve, reject));\n};\n\napi.url = (path, detectGuestSpace = false) =>\n  (detectGuestSpace\n    ? `https://dummy.cybozu.com/k/guest/1${path.replace(/\\/k/, '')}.json`\n    : `https://dummy.cybozu.com${path}.json`);\n\napi.urlForGet = (path, params, detectGuestSpace = false) => {\n  const getQuery = obj =>\n    Object.keys(obj).reduce((result, key) => {\n      if (Array.isArray(obj[key])) {\n        result.push(...obj[key].map((a, i) => `${key}[${i}]=${a}`));\n      } else if (obj[key] instanceof Object) {\n        result.push(getQuery(obj[key]).map(a => `${key}.${a}`));\n      } else {\n        result.push(`${key}=${obj[key].toString()}`);\n      }\n      return result;\n    }, []);\n  const query = getQuery(params)\n    .toString()\n    .replace(/,/g, '&');\n  return detectGuestSpace\n    ? `https://dummy.cybozu.com/k/guest/1${path.replace(/\\/k/, '')}.json?${query}`\n    : `https://dummy.cybozu.com${path}.json?${query}`;\n};\n\napi.getConcurrencyLimit = () => new Promise(resolve => resolve({ limit: 0, running: 0 }));\n\nmodule.exports = api;\n\n\n//# sourceURL=webpack:///./lib/api/index.js?");

/***/ }),

/***/ "./lib/api/record_api.js":
/*!*******************************!*\
  !*** ./lib/api/record_api.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const schema = __webpack_require__(/*! ./../schema */ \"./lib/schema.js\");\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\n\nmodule.exports = class RecordApi {\n  constructor(params) {\n    this.params = params;\n  }\n\n  do(method, callback, errback) {\n    if (method === 'GET') {\n      this.get(callback, errback);\n    } else if (method === 'POST') {\n      this.post(callback, errback);\n    } else if (method === 'PUT') {\n      this.put(callback, errback);\n    } else {\n      errback({ message: `Invalid method [${method}]` });\n    }\n  }\n\n  get(callback, errback) {\n    const validate = () =>\n      this.params.app &&\n      this.params.app.toString() === schema.app.appId &&\n      this.params.id &&\n      Number(this.params.id);\n\n    if (validate()) {\n      const record = fixture.find(this.params.id.toString());\n      if (record) {\n        callback({ record });\n        return;\n      }\n    }\n    errback({ message: 'Invalid params' });\n  }\n\n  post(callback, errback) {\n    const validate = () =>\n      this.params.app && this.params.app.toString() === schema.app.appId && this.params.record;\n\n    if (validate()) {\n      this.params.record.$id = {\n        type: '__ID__',\n        value: '',\n      };\n      this.params.record.$revision = {\n        type: '__REVISION__',\n        value: '',\n      };\n\n      Object.keys(schema.fields.properties)\n        // enable = false はスキップ\n        .filter((key) => {\n          const prop = schema.fields.properties[key];\n          return !('enabled' in prop) || prop.enabled;\n        })\n        .forEach((key) => {\n          if (!(key in this.params.record)) {\n            const prop = schema.fields.properties[key];\n            this.params.record[key] = {\n              type: prop.type,\n              value: (() => {\n                if (prop.type === 'CREATOR' || prop.type === 'MODIFIER') {\n                  return {\n                    code: '',\n                    name: '',\n                  };\n                } else if ('defaultValue' in prop) {\n                  return prop.defaultValue;\n                }\n                return '';\n              })(),\n            };\n          }\n        });\n      const newId = fixture.register(this.params.record);\n      callback({\n        id: newId.toString(),\n        revision: '1',\n      });\n      return;\n    }\n    errback({ message: 'Invalid params' });\n  }\n\n  put(callback, errback) {\n    const getRecord = () => {\n      if (this.params.id) {\n        return fixture.find(this.params.id.toString());\n      }\n      const { field } = this.params.updateKey;\n      const { value } = this.params.updateKey;\n      const record = fixture.records.find(a => a[field].value === value);\n      return fixture.find(record.$id.value);\n    };\n\n    const validate = () => {\n      if (!this.params.app && this.params.app.toString() !== schema.app.appId) {\n        return false;\n      }\n      if (\n        this.params.revision &&\n        this.params.revision.toString() !== '-1' &&\n        this.params.revision.toString() !== getRecord().$revision.value\n      ) {\n        return false;\n      }\n      if (\n        this.params.updateKey &&\n        (!schema.fields.properties[this.params.updateKey.field] ||\n          !schema.fields.properties[this.params.updateKey.field].unique)\n      ) {\n        return false;\n      }\n\n      return true;\n    };\n\n    if (validate()) {\n      const record = getRecord();\n      if (this.params.record) {\n        Object.keys(this.params.record).forEach((key) => {\n          fixture.updateFieldById(record.$id.value, key, this.params.record[key].value);\n        });\n        record.$revision.value = (Number(record.$revision.value) + 1).toString();\n      }\n      callback({\n        revision: record.$revision.value,\n      });\n      return;\n    }\n    errback({ message: 'Invalid params' });\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/api/record_api.js?");

/***/ }),

/***/ "./lib/app/index.js":
/*!**************************!*\
  !*** ./lib/app/index.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-undef, class-methods-use-this, no-unused-vars */\n\nconst Record = __webpack_require__(/*! ./../app/record */ \"./lib/app/record.js\");\nconst schema = __webpack_require__(/*! ./../schema */ \"./lib/schema.js\");\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\n\nconst exists = (fn) => {\n  try {\n    return fn() !== undefined;\n  } catch (e) {\n    return false;\n  }\n};\n\nmodule.exports = class App {\n  constructor() {\n    this.record = new Record();\n  }\n\n  getId() {\n    return schema.app.appId || null;\n  }\n\n  getFieldElements() {\n    // lib/index.jsでFieldElementsを呼び出して、動的にこのメソッドを定義する。\n  }\n\n  static FieldElements(type) {\n    const allows = ['app.record.index'];\n    const isAllow = () => allows.some(a => type.startsWith(a));\n\n    if (!isAllow() || !schema.fields.properties) return fieldCode => null;\n    if (fixture.records.length === 0) return fieldCode => [];\n\n    return (fieldCode) => {\n      if (!schema.fields.properties[fieldCode]) return null;\n      function* gen() {\n        for (let i = 0; i < fixture.records.length; i += 1) {\n          const div = document.createElement('div');\n          document.body.appendChild(div);\n          yield div;\n        }\n      }\n      return [...gen()]; // 空divの配列を返す\n    };\n  }\n\n  getHeaderSpaceElement() {\n    // lib/index.jsでHeaderSpaceElementを呼び出して、動的にこのメソッドを定義する。\n  }\n\n  getHeaderMenuSpaceElement() {\n    // lib/index.jsでHeaderSpaceElementを呼び出して、動的にこのメソッドを定義する。\n  }\n\n  static HeaderSpaceElement(type) {\n    const allows = ['app.record.index'];\n    const isAllow = () => allows.some(a => type.startsWith(a));\n    if (!isAllow()) return () => null;\n    return () => document.body;\n  }\n\n  getLookupTargetAppId(fieldCode) {\n    if (exists(() => schema.fields.properties[fieldCode].lookup.relatedApp.app)) {\n      return schema.fields.properties[fieldCode].lookup.relatedApp.app;\n    }\n    return null;\n  }\n\n  getRelatedRecordsTargetAppId(fieldCode) {\n    if (exists(() => schema.fields.properties[fieldCode].referenceTable.relatedApp.app)) {\n      return schema.fields.properties[fieldCode].referenceTable.relatedApp.app;\n    }\n    return null;\n  }\n\n  getQuery() {\n    // lib/index.jsでQueryConditionを呼び出して、動的にこのメソッドを定義する。\n  }\n\n  getQueryCondition() {\n    // lib/index.jsでQueryConditionを呼び出して、動的にこのメソッドを定義する。\n    // typeやviewIdなど、Appクラスのプロパティとして公開したくない為\n  }\n\n  static QueryCondition(type, viewId) {\n    const allows = ['app.record.index', 'app.report'];\n    const isAllow = () => allows.some(a => type.startsWith(a));\n    if (!isAllow()) {\n      return () => null;\n    }\n    const { views } = schema.views;\n    const view = views\n      ? Object.keys(views)\n        .map(key => views[key])\n        .find(item => item.id === viewId)\n      : null;\n    return () => (view ? view.filterCond : '');\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/app/index.js?");

/***/ }),

/***/ "./lib/app/record.js":
/*!***************************!*\
  !*** ./lib/app/record.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-undef, class-methods-use-this, no-unused-vars */\n\nconst schema = __webpack_require__(/*! ./../schema */ \"./lib/schema.js\");\n\nmodule.exports = class Record {\n  constructor(type, data) {\n    this.type = type;\n    this.data = data;\n  }\n\n  getId() {\n    const allows = ['app.record.detail', 'app.record.edit', 'app.record.print'];\n    const isAllow = () => allows.some(a => this.type.startsWith(a));\n    return this.data && isAllow() ? this.data.$id.value : null;\n  }\n\n  get() {\n    const allows = [\n      'app.record.detail',\n      'app.record.create',\n      'app.record.edit',\n      'app.record.print',\n    ];\n    const isAllow = () => allows.some(a => this.type.startsWith(a));\n    return this.data && isAllow() ? JSON.parse(JSON.stringify({ record: this.data })) : null;\n  }\n\n  set(data) {\n    const allows = ['app.record.create', 'app.record.edit'];\n    const isAllow = () => allows.some(a => this.type.startsWith(a));\n    if (isAllow()) {\n      this.data = JSON.parse(JSON.stringify(data.record));\n    }\n  }\n\n  setFieldShown(fieldCode, isShown) {\n    // 何もしない\n  }\n\n  setGroupFieldOpen(fieldCode, isOpen) {\n    // 何もしない\n  }\n\n  getFieldElement(fieldCode) {\n    const allows = ['app.record.detail', 'app.record.print'];\n    const isAllow = () => allows.some(a => this.type.startsWith(a));\n    if (isAllow() && schema.fields.properties) {\n      if (schema.fields.properties[fieldCode]) {\n        const div = document.createElement('div');\n        document.body.appendChild(div);\n        return div; // 空divを返す\n      }\n    }\n    return null;\n  }\n\n  getHeaderMenuSpaceElement() {\n    return document.body; // bodyを返す\n  }\n\n  getSpaceElement(id) {\n    const allows = [\n      'app.record.detail',\n      'app.record.create',\n      'app.record.edit',\n      'app.record.print',\n    ];\n    const isAllow = () => allows.some(a => this.type.startsWith(a));\n    if (isAllow() && schema.form.properties) {\n      const target = Object.keys(schema.form.properties).find((key) => {\n        const prop = schema.form.properties[key];\n        return prop.type === 'SPACER' && prop.elementId === id;\n      });\n      if (target) {\n        const div = document.createElement('div');\n        document.body.appendChild(div);\n        return div; // 空divを返す\n      }\n    }\n    return null;\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/app/record.js?");

/***/ }),

/***/ "./lib/event/event_object.js":
/*!***********************************!*\
  !*** ./lib/event/event_object.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const schema = __webpack_require__(/*! ./../schema */ \"./lib/schema.js\");\n\nmodule.exports = class EventObject {\n  constructor(event) {\n    this.appId = schema.app.appId;\n    this.type = event;\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/event_object.js?");

/***/ }),

/***/ "./lib/event/index.js":
/*!****************************!*\
  !*** ./lib/event/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-eval, no-console */\n\nconst { EventEmitter } = __webpack_require__(/*! events */ \"events\");\n\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\nconst RecordEditEventObject = __webpack_require__(/*! ./record_edit_event_object */ \"./lib/event/record_edit_event_object.js\");\nconst RecordEditSubmitEventObject = __webpack_require__(/*! ./record_edit_submit_event_object */ \"./lib/event/record_edit_submit_event_object.js\");\nconst RecordEditSubmitSuccessEventObject = __webpack_require__(/*! ./record_edit_submit_success_event_object */ \"./lib/event/record_edit_submit_success_event_object.js\");\nconst RecordDeleteEventObject = __webpack_require__(/*! ./record_delete_event_object */ \"./lib/event/record_delete_event_object.js\");\nconst RecordChangeEventObject = __webpack_require__(/*! ./record_change_event_object */ \"./lib/event/record_change_event_object.js\");\nconst RecordProcessEventObject = __webpack_require__(/*! ./record_process_event_object */ \"./lib/event/record_process_event_object.js\");\nconst RecordsEventObject = __webpack_require__(/*! ./records_event_object */ \"./lib/event/records_event_object.js\");\nconst ReportEventObject = __webpack_require__(/*! ./report_event_object */ \"./lib/event/report_event_object.js\");\n\nconst schema = __webpack_require__(/*! ../schema */ \"./lib/schema.js\");\n\n// kintone.eventsからアクセスできないようにEventクラス外へ配置\nconst app = {\n  record: {\n    index: {\n      show: (event, options) => new RecordsEventObject(event, options),\n      edit: {\n        show: (event, options) => new RecordEventObject(event, options),\n        submit: (event, options) => new RecordEditSubmitEventObject(event, options),\n        change: {},\n      },\n      delete: {\n        submit: (event, options) => new RecordDeleteEventObject(event, options),\n      },\n    },\n    detail: {\n      show: (event, options) => new RecordEventObject(event, options),\n      delete: {\n        submit: (event, options) => new RecordDeleteEventObject(event, options),\n      },\n      process: {\n        proceed: (event, options) => new RecordProcessEventObject(event, options),\n      },\n    },\n    create: {\n      show: (event, options) => new RecordEditEventObject(event, options),\n      submit: (event, options) => new RecordEditSubmitEventObject(event, options),\n      change: {},\n    },\n    edit: {\n      show: (event, options) => new RecordEditEventObject(event, options),\n      submit: (event, options) => new RecordEditSubmitEventObject(event, options),\n      change: {},\n    },\n    print: {\n      show: (event, options) => new RecordEventObject(event, options),\n    },\n  },\n  report: {\n    show: (event, options) => new ReportEventObject(event, options),\n  },\n};\n\n// 関数に関数を定義する\napp.record.index.edit.submit.success = (event, options) =>\n  new RecordEditSubmitSuccessEventObject(event, options);\napp.record.create.submit.success = (event, options) =>\n  new RecordEditSubmitSuccessEventObject(event, options);\napp.record.edit.submit.success = (event, options) =>\n  new RecordEditSubmitSuccessEventObject(event, options);\n\n// fields項目の関数を定義する\nconst appendFieldChangeEvent = (event) => {\n  const match = event.match(/^(app\\.record\\.(index\\.edit|edit|create)\\.change)\\.([^.]+)$/);\n  if (!match) return;\n  const key = match[3];\n  if (!schema.fields.properties || !schema.fields.properties[key]) return;\n  const { type } = schema.fields.properties[key];\n  if (!RecordChangeEventObject.TYPES.some(t => t === type)) return;\n\n  eval(`${match[1]}`)[key] = (ev, options) =>\n    // match[2]=editの場合のみ、トリガの変更がキャンセルされる可能性がある\n    new RecordChangeEventObject(ev, options, type, match[2] !== 'edit');\n};\n\nconst removeFieldChangeEvent = (event) => {\n  if (event) {\n    const match = event.match(/^(app\\.record\\.(index\\.edit|edit|create)\\.change)\\.([^.]+)$/);\n    if (!match) return;\n    const key = match[3];\n    if (typeof eval(`${event}`) === 'function') {\n      eval(`${match[1]}`)[key] = {};\n    }\n  } else {\n    app.record.index.edit.change = {};\n    app.record.edit.change = {};\n    app.record.create.change = {};\n  }\n};\n\nconst validate = (event) => {\n  if (\n    !event.match(/^app\\.(record|report)(\\.(index|detail))?(\\.(create|edit|delete|print))?(\\.(show|change|submit|process))?(\\.(success|proceed))?(\\..+)?$/)\n  ) {\n    console.warn(`\\nno match event : ${event}`);\n    return false;\n  }\n\n  if (typeof eval(`${event}`) !== 'function') {\n    console.warn(`\\nmissing event : ${event}`);\n    return false;\n  }\n  return true;\n};\n\nmodule.exports = class Event extends EventEmitter {\n  emit(event, ...args) {\n    const promises = [];\n    this.listeners(event).forEach((listener) => {\n      promises.push(listener(...args));\n    });\n    return Promise.all(promises);\n  }\n\n  async do(event, options) {\n    appendFieldChangeEvent(event);\n    if (!validate(event)) return null;\n\n    const eventObj = eval(`${event}`)(event, options);\n    // kintone.appへ変更を通知\n    await this.emit('event.do', event, options);\n    await this.emit('event.type.changed', event, eventObj.record);\n    // 複数ハンドラ登録されていた場合、最後のみ反映させる為popする\n    const resolve = (await this.emit(event, eventObj)).pop();\n\n    if (resolve && resolve.done) resolve.done();\n    if (eventObj.cancel) eventObj.cancel(resolve);\n\n    return resolve;\n  }\n\n  off(event) {\n    if (event) {\n      this.removeAllListeners(event);\n    } else {\n      this.removeAllListeners();\n    }\n    removeFieldChangeEvent(event);\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/index.js?");

/***/ }),

/***/ "./lib/event/record_change_event_object.js":
/*!*************************************************!*\
  !*** ./lib/event/record_change_event_object.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// record.index.edit.change.<field>\n// record.edit.change.<field>\n// record.create.change.<field>\n\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\n\nconst getKey = (type) => {\n  const keys = type.split('.');\n  return keys[keys.length - 1];\n};\n\nmodule.exports = class RecordChangeEventObject extends RecordEventObject {\n  constructor(event, options = {}, type, triggerNotCancel) {\n    super(event, options);\n\n    if (options.value === undefined) throw new Error('value option is required.');\n\n    this.changes = {\n      field: {\n        type,\n        value: options.value,\n      },\n      row: {},\n    };\n\n    if (triggerNotCancel && this.record) {\n      this.record[getKey(this.type)].value = options.value;\n      this.rollbackDisallowFields();\n      fixture.update(this.record);\n    }\n  }\n\n  done() {\n    if (this.record) {\n      this.record[getKey(this.type)].value = this.changes.field.value;\n      this.rollbackDisallowFields();\n      fixture.update(this.record);\n    }\n  }\n\n  static get TYPES() {\n    return [\n      'RADIO_BUTTON',\n      'DROP_DOWN',\n      'CHECK_BOX',\n      'MULTI_SELECT',\n      'USER_SELECT',\n      'ORGANIZATION_SELECT',\n      'GROUP_SELECT',\n      'DATE',\n      'TIME',\n      'DATETIME',\n      'SINGLE_LINE_TEXT',\n      'NUMBER',\n      'SUBTABLE',\n    ];\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_change_event_object.js?");

/***/ }),

/***/ "./lib/event/record_delete_event_object.js":
/*!*************************************************!*\
  !*** ./lib/event/record_delete_event_object.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// app.record.detail.delete.submit\n// app.record.index.delete.submit\n\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\n\nmodule.exports = class RecordDeleteEventObject extends RecordEventObject {\n  constructor(event, options = {}) {\n    super(event, options);\n  }\n\n  done() {\n    fixture.delete(this.recordId);\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_delete_event_object.js?");

/***/ }),

/***/ "./lib/event/record_edit_event_object.js":
/*!***********************************************!*\
  !*** ./lib/event/record_edit_event_object.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// app.record.create.show\n// app.record.edit.show\n\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\n\nmodule.exports = class RecordEditEventObject extends RecordEventObject {\n  constructor(event, options = {}) {\n    super(event, options);\n    this.reuse = false;\n  }\n\n  done() {\n    this.rollbackDisallowFields();\n    fixture.update(this.record);\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_edit_event_object.js?");

/***/ }),

/***/ "./lib/event/record_edit_submit_event_object.js":
/*!******************************************************!*\
  !*** ./lib/event/record_edit_submit_event_object.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// record.index.edit.submit\n// record.create.submit\n// record.edit.submit\n\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\n\nmodule.exports = class RecordEditSubmitEventObject extends RecordEventObject {\n  constructor(event, options = {}) {\n    super(event, options);\n  }\n\n  done() {\n    this.rollbackDisallowFields();\n    fixture.update(this.record);\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_edit_submit_event_object.js?");

/***/ }),

/***/ "./lib/event/record_edit_submit_success_event_object.js":
/*!**************************************************************!*\
  !*** ./lib/event/record_edit_submit_success_event_object.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// record.index.edit.submit.success\n// record.create.submit.success\n// record.edit.submit.success\n\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\n\nmodule.exports = class RecordEditSubmitSuccessEventObject extends RecordEventObject {\n  constructor(event, options = {}) {\n    super(event, options);\n    this.url = null;\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_edit_submit_success_event_object.js?");

/***/ }),

/***/ "./lib/event/record_event_object.js":
/*!******************************************!*\
  !*** ./lib/event/record_event_object.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// app.record.index.edit.show\n// app.record.detail.show\n// app.record.print.show\n\nconst schema = __webpack_require__(/*! ./../schema */ \"./lib/schema.js\");\nconst fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst EventObject = __webpack_require__(/*! ./event_object */ \"./lib/event/event_object.js\");\n\nmodule.exports = class RecordEventObject extends EventObject {\n  constructor(event, options = {}) {\n    super(event);\n\n    if (!options.recordId) throw new Error('recordId option is required.');\n\n    const copy = fixture.find(options.recordId.toString());\n    if (copy) {\n      const record = JSON.parse(JSON.stringify(copy));\n      this.recordId = record.$id.value;\n      this.record = record;\n    }\n  }\n\n  rollbackDisallowFields() {\n    const EDIT_DISALLOWS = [\n      'RECORD_NUMBER',\n      'CREATOR',\n      'CREATED_TIME',\n      'MODIFIER',\n      'UPDATED_TIME',\n      'STATUS',\n      'STATUS_ASSIGNEE',\n      'CALC',\n      'FILE',\n    ];\n\n    const isDisallows = key => EDIT_DISALLOWS.some(a => a === schema.fields.properties[key].type);\n\n    const isAutoCalc = key =>\n      schema.fields.properties[key].type === 'SINGLE_LINE_TEXT' &&\n      schema.fields.properties[key].expression;\n\n    const isLookup = key =>\n      (schema.fields.properties[key].type === 'SINGLE_LINE_TEXT' ||\n        schema.fields.properties[key].type === 'NUMBER') &&\n      schema.fields.properties[key].lookup;\n\n    const isLookupMapping = (key) => {\n      const mappings = Object.keys(schema.fields.properties)\n        .filter(k =>\n          schema.fields.properties[k].lookup && schema.fields.properties[k].lookup.fieldMappings)\n        .map(k => schema.fields.properties[k].lookup.fieldMappings);\n      return mappings.some(a => a.some(b => b.field === key));\n    };\n\n    const hasSchema = key =>\n      (schema.fields.properties ? Object.keys(schema.fields.properties).some(a => a === key) : false);\n\n    if (this.record) {\n      Object.keys(this.record)\n        .filter(key => hasSchema(key))\n        .forEach((key) => {\n          // 編集非許可のフィールド or 文字列かつ自動計算 or ルックアップ or ルックアップコピー先 は編集不可\n          if (isDisallows(key) || isAutoCalc(key) || isLookup(key) || isLookupMapping(key)) {\n            this.record[key].value = fixture.find(this.recordId)[key].value;\n          }\n          // ラジオボタンフィールドで空文字列を指定した場合、初期値の選択肢になる\n          if (\n            schema.fields.properties[key].type === 'RADIO_BUTTON' &&\n            this.record[key].value === ''\n          ) {\n            this.record[key].value = schema.fields.properties[key].defaultValue;\n          }\n        });\n    }\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_event_object.js?");

/***/ }),

/***/ "./lib/event/record_process_event_object.js":
/*!**************************************************!*\
  !*** ./lib/event/record_process_event_object.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst RecordEventObject = __webpack_require__(/*! ./record_event_object */ \"./lib/event/record_event_object.js\");\n\nmodule.exports = class RecordProcessEventObject extends RecordEventObject {\n  constructor(event, options = {}) {\n    super(event, options);\n\n    if (options.action === undefined) throw new Error('action option is required.');\n    if (options.status === undefined) throw new Error('status option is required.');\n    if (options.nextStatus === undefined) throw new Error('nextStatus option is required.');\n\n    this.action = { value: options.action };\n    this.status = { value: options.status };\n    this.nextStatus = { value: options.nextStatus };\n    this.error = null;\n\n    if (this.record) {\n      this.record.ステータス.value = this.nextStatus.value;\n      fixture.update(this.record);\n    }\n  }\n\n  done() {\n    if (!this.error && this.record) {\n      this.rollbackDisallowFields();\n      fixture.update(this.record);\n    }\n  }\n\n  cancel(resolve) {\n    if (resolve === undefined) return;\n    if (!resolve.error && resolve instanceof RecordProcessEventObject) return;\n\n    // ステータスを元に戻す、ステータス以外の項目はそもそもupdate掛かっていないので戻さなくてOK\n    fixture.updateFieldById(this.recordId, 'ステータス', this.status.value);\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/record_process_event_object.js?");

/***/ }),

/***/ "./lib/event/records_event_object.js":
/*!*******************************************!*\
  !*** ./lib/event/records_event_object.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fixture = __webpack_require__(/*! ./../fixture */ \"./lib/fixture.js\");\nconst schema = __webpack_require__(/*! ./../schema */ \"./lib/schema.js\");\nconst EventObject = __webpack_require__(/*! ./event_object */ \"./lib/event/event_object.js\");\n\nconst DEFAULT_VIEW_ID = '20';\n\n/* eslint-disable no-param-reassign */\n\nconst calendarRecords = (keyColumn, yyyymm) =>\n  JSON.parse(JSON.stringify(fixture.records))\n    .filter(r => r[keyColumn].value && r[keyColumn].value.startsWith(yyyymm))\n    // [...record] から { date: [...record],} へ変換\n    .reduce((prev, cur) => {\n      if (cur[keyColumn].value) {\n        const date = cur[keyColumn].value.slice(0, 10);\n        if (!prev[date]) prev[date] = [];\n        prev[date].push(cur);\n      }\n      return prev;\n    }, {});\n\nmodule.exports = class RecordsEventObject extends EventObject {\n  constructor(event, options = {}) {\n    super(event);\n\n    const { views } = schema.views;\n    const view = views\n      ? Object.keys(views)\n        .map(key => views[key])\n        .find(item => item.id === options.viewId)\n      : null;\n    this.viewId = view ? view.id : DEFAULT_VIEW_ID;\n    this.viewName = view ? view.name : '（すべて）';\n    this.viewType = view ? view.type.toLowerCase() : 'list';\n\n    const isCalendar = () => this.viewType === 'calendar';\n\n    this.date = (() => {\n      if (!isCalendar()) return null;\n      if (options.date) return options.date;\n      throw new Error('date option is required when selected calendar');\n    })();\n\n    this.offset = (() => {\n      if (isCalendar()) return null;\n      return options.offset ? options.offset : 0;\n    })();\n\n    this.records = (() => {\n      if (isCalendar()) {\n        return calendarRecords(view.date, this.date);\n      }\n      const limit = options.limit ? options.limit : 100;\n      // record.skip(offset).take(limit)...って書きたい\n      // TODO viewのfilterとsort条件の実装\n      return JSON.parse(JSON.stringify(fixture.records))\n        .slice(this.offset)\n        .slice(0, limit);\n    })();\n    this.size = isCalendar() ? null : this.records.length;\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/records_event_object.js?");

/***/ }),

/***/ "./lib/event/report_event_object.js":
/*!******************************************!*\
  !*** ./lib/event/report_event_object.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// app.report.show\n\nconst EventObject = __webpack_require__(/*! ./event_object */ \"./lib/event/event_object.js\");\n\nmodule.exports = class ReportEventObject extends EventObject {\n  constructor(event, options = {}) {\n    super(event, options);\n  }\n};\n\n\n//# sourceURL=webpack:///./lib/event/report_event_object.js?");

/***/ }),

/***/ "./lib/fixture.js":
/*!************************!*\
  !*** ./lib/fixture.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-param-reassign */\n\nconst fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst DIR_FIXTURE = '.kintuba/fixture';\nconst ENCODING = 'utf8';\n\nconst loadFile = (filePath, defaults, shown = false) => {\n  try {\n    const json = JSON.parse(fs.readFileSync(filePath, ENCODING));\n    if (shown) {\n      // eslint-disable-next-line no-console\n      console.info(`Load setting : ${filePath}`);\n    }\n    return json;\n  } catch (err) {\n    if (shown) {\n      // eslint-disable-next-line no-console\n      console.info(`Load default : ${filePath}`);\n    }\n    return defaults;\n  }\n};\n\n// // ログイン情報\n// exports.login = (() => loadFile(`${DIR_FIXTURE}/login.json`, {}, true))();\n\n// // レコードデータ\n// exports.records = (() => loadFile(`${DIR_FIXTURE}/records.json`, [], true))();\n\nexports.login = {};\n\nexports.records = [];\n\nexports.load = (dirname = DIR_FIXTURE) => {\n  this.login = loadFile(`${dirname}/login.json`, {});\n  this.records = loadFile(`${dirname}/records.json`, []);\n};\n\nexports.find = (id) => {\n  const record = this.records.find(r => r.$id.value === id);\n  return record ? JSON.parse(JSON.stringify(record)) : null;\n};\n\nexports.register = (record) => {\n  if (record) {\n    const newId = Math.max(...this.records.map(a => a.$id.value)) + 1;\n    record.$id.value = newId.toString();\n    this.records.push(JSON.parse(JSON.stringify(record)));\n    return newId;\n  }\n  return null;\n};\n\nexports.update = (record) => {\n  if (record) {\n    this.delete(record.$id.value);\n    this.records.push(JSON.parse(JSON.stringify(record)));\n  }\n};\n\nexports.updateFieldById = (id, field, value) => {\n  const record = this.records.find(r => r.$id.value === id);\n  if (record) {\n    record[field].value = value;\n  }\n};\n\nexports.delete = (id) => {\n  this.records = this.records.filter(r => r.$id.value !== id);\n};\n\n\n//# sourceURL=webpack:///./lib/fixture.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-undef, class-methods-use-this, no-param-reassign */\n\nconst App = __webpack_require__(/*! ./app */ \"./lib/app/index.js\");\nconst Api = __webpack_require__(/*! ./api */ \"./lib/api/index.js\");\nconst Record = __webpack_require__(/*! ./app/record */ \"./lib/app/record.js\");\nconst Plugin = __webpack_require__(/*! ./plugin */ \"./lib/plugin/index.js\");\nconst Proxy = __webpack_require__(/*! ./proxy */ \"./lib/proxy/index.js\");\nconst Event = __webpack_require__(/*! ./event */ \"./lib/event/index.js\");\nconst schema = __webpack_require__(/*! ./schema */ \"./lib/schema.js\");\nconst fixture = __webpack_require__(/*! ./fixture */ \"./lib/fixture.js\");\n\nconst parse = (value, defaultValue = {}) => {\n  try {\n    return JSON.parse(value);\n  } catch (e) {\n    return defaultValue;\n  }\n};\n\nclass Kintuba {\n  constructor() {\n    this.app = new App();\n    this.api = Api;\n    this.plugin = Plugin;\n    this.proxy = Proxy;\n    this.events = new Event();\n    this.Promise = Promise;\n\n    // 外部に公開したくないパラメータを利用するメンバを動的に定義する。\n    this.events.on('event.do', (type, options) => {\n      this.app.getFieldElements = App.FieldElements(type);\n      this.app.getHeaderSpaceElement = App.HeaderSpaceElement(type);\n      this.app.getHeaderMenuSpaceElement = App.HeaderSpaceElement(type);\n      this.app.getQuery = App.QueryCondition(type, options ? options.viewId : null);\n      this.app.getQueryCondition = App.QueryCondition(type, options ? options.viewId : null);\n    });\n    this.events.on('event.type.changed', (type, record) => {\n      this.app.record = new Record(type, record);\n    });\n\n    this.schema = {\n      app: {\n        set: (contents) => {\n          schema.app = parse(contents);\n        },\n      },\n      fields: {\n        set: (contents) => {\n          schema.fields = parse(contents);\n        },\n      },\n      form: {\n        set: (contents) => {\n          schema.form = parse(contents);\n        },\n      },\n      views: {\n        set: (contents) => {\n          schema.views = parse(contents);\n        },\n      },\n    };\n    this.schema.load = dirname => schema.load(dirname);\n    this.fixture = {\n      login: {\n        set: (contents) => {\n          fixture.login = parse(contents);\n        },\n      },\n      records: {\n        set: (contents) => {\n          fixture.records = parse(contents, []);\n        },\n      },\n    };\n    this.fixture.load = dirname => fixture.load(dirname);\n  }\n\n  getLoginUser() {\n    return fixture.login;\n  }\n\n  getUiVersion() {\n    return 2;\n  }\n}\n\nglobal.kintone = new Kintuba();\n\n\n//# sourceURL=webpack:///./lib/index.js?");

/***/ }),

/***/ "./lib/plugin/index.js":
/*!*****************************!*\
  !*** ./lib/plugin/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const plugin = {\n  app: {\n    getConfig: () => null,\n    setConfig: (config, callback) => {\n      if (callback) callback();\n    },\n    getProxyConfig: () => null,\n    setProxyConfig: (url, method, headers, data, callback) => {\n      if (callback) callback();\n    },\n    proxy() {},\n  },\n};\n\nplugin.app.proxy.upload = () => {};\n\nmodule.exports = plugin;\n\n\n//# sourceURL=webpack:///./lib/plugin/index.js?");

/***/ }),

/***/ "./lib/proxy/index.js":
/*!****************************!*\
  !*** ./lib/proxy/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const proxy = () => {};\nproxy.upload = () => {};\n\nmodule.exports = proxy;\n\n\n//# sourceURL=webpack:///./lib/proxy/index.js?");

/***/ }),

/***/ "./lib/schema.js":
/*!***********************!*\
  !*** ./lib/schema.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fs = __webpack_require__(/*! fs */ \"fs\");\n\nconst DIR_SCHEMA = '.kintuba/schema';\nconst ENCODING = 'utf8';\n\nconst loadFile = (filePath, defaults) => {\n  try {\n    return JSON.parse(fs.readFileSync(filePath, ENCODING));\n  } catch (err) {\n    return defaults;\n  }\n};\n\nexports.app = {};\n\nexports.views = {};\n\nexports.fields = {};\n\nexports.form = {};\n\nexports.load = (dirname = DIR_SCHEMA) => {\n  this.app = loadFile(`${dirname}/app.json`, {});\n  this.views = loadFile(`${dirname}/views.json`, {});\n  this.fields = loadFile(`${dirname}/fields.json`, {});\n  this.form = loadFile(`${dirname}/form.json`, {});\n};\n\n\n//# sourceURL=webpack:///./lib/schema.js?");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");\n\n//# sourceURL=webpack:///external_%22events%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ })

/******/ });
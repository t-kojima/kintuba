#!/usr/bin/env node

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

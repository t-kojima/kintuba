#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this */

const Record = require('./../app/record');
const schema = require('./../schema');

module.exports = class App {
  constructor() {
    this.record = new Record();
  }

  getId() {
    return schema.app.appId;
  }

  getHeaderMenuSpaceElement() {
    return document.body;
  }

  getFieldElements() {
    return {};
  }

  getHeaderSpaceElement() {
    return {};
  }

  getLookupTargetAppId() {
    return {};
  }

  getQuery() {
    // index.jsでQueryConditionを呼び出して、動的にこのメソッドを定義する。
  }

  getQueryCondition() {
    // index.jsでQueryConditionを呼び出して、動的にこのメソッドを定義する。
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

  getRelatedRecordsTargetAppId() {
    return {};
  }
};

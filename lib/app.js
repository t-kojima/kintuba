#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this */

class Record {
  constructor(data) {
    this.data = data;
  }
  getId() {
    return this.data ? this.data.$id.value : null;
  }
  get() {
    return this.data ? { record: this.data } : null;
  }
  set(data) {
    this.data = data;
  }
}

module.exports = class App {
  constructor() {
    this.record = new Record(null);
  }

  getId() {
    return 1;
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
    return {};
  }

  getQueryCondition() {
    return {};
  }

  getRelatedRecordsTargetAppId() {
    return {};
  }
};

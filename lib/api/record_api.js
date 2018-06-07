#!/usr/bin/env node

const fixture = require('./../fixture');

module.exports = class RecordApi {
  constructor(params) {
    this.params = params;
  }

  validate() {
    return this.params.id && Number(this.params.id);
  }

  do(method, callback, errback) {
    if (method === 'GET') {
      this.get(callback, errback);
    } else {
      errback({ message: `Invalid method [${method}]` });
    }
  }

  get(callback, errback) {
    if (this.validate()) {
      const record = fixture.find(this.params.id.toString());
      if (record) {
        callback({ record });
        return;
      }
    }
    errback({ message: 'Invalid params' });
  }
};

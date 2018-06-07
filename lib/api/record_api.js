#!/usr/bin/env node

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
      const newId = fixture.register(this.params.record);
      callback({
        id: newId.toString(),
        revision: '1',
      });
    }
    errback({ message: 'Invalid params' });
  }
};

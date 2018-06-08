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

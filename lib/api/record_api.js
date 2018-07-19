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
      this.params.app &&
      this.params.app.toString() === schema.app.appId &&
      this.params.record;

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
        .filter(key => {
          const prop = schema.fields.properties[key];
          return !('enabled' in prop) || prop.enabled;
        })
        .forEach(key => {
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
                }
                if ('defaultValue' in prop) {
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

  put(callback, errback) {
    const getRecord = () => {
      if (this.params.id) {
        return fixture.find(this.params.id.toString());
      }
      const { field } = this.params.updateKey;
      const { value } = this.params.updateKey;
      const record = fixture.records.find(a => a[field].value === value);
      return fixture.find(record.$id.value);
    };

    const validate = () => {
      if (!this.params.app && this.params.app.toString() !== schema.app.appId) {
        return false;
      }
      if (
        this.params.revision &&
        this.params.revision.toString() !== '-1' &&
        this.params.revision.toString() !== getRecord().$revision.value
      ) {
        return false;
      }
      if (
        this.params.updateKey &&
        (!schema.fields.properties[this.params.updateKey.field] ||
          !schema.fields.properties[this.params.updateKey.field].unique)
      ) {
        return false;
      }

      return true;
    };

    if (validate()) {
      const record = getRecord();
      if (this.params.record) {
        Object.keys(this.params.record).forEach(key => {
          fixture.updateFieldById(
            record.$id.value,
            key,
            this.params.record[key].value
          );
        });
        record.$revision.value = (
          Number(record.$revision.value) + 1
        ).toString();
      }
      callback({
        revision: record.$revision.value,
      });
      return;
    }
    errback({ message: 'Invalid params' });
  }
};

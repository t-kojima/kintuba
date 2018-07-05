/* eslint-disable no-param-reassign */

exports.login = {};

exports.records = [];

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

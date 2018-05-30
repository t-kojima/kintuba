#!/usr/bin/env node

const schema = require('./../schema');
const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordChangeEventObject extends RecordEventObject {
  constructor(event, options = {}, type) {
    super(event, options);

    if (options.value === undefined) throw new Error('value option is required.');

    this.changes = {
      field: {
        type,
        value: options.value,
      },
      row: {},
    };
  }

  done() {
    const key = (() => {
      const keys = this.type.split('.');
      return keys[keys.length - 1];
    })();

    this.record[key].value = this.changes.field.value;
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

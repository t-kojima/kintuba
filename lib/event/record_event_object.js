#!/usr/bin/env node

const fixture = require('./../fixture');
const EventObject = require('./event_object');

module.exports = class RecordEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    if (!options.recordId) throw new Error('recordId option is required.');

    const copy = fixture.records.find(a => a.$id.value === options.recordId);
    if (options.test) console.log(copy.数値.value);
    if (copy) {
      const record = JSON.parse(JSON.stringify(copy));
      this.recordId = record.$id.value;
      this.record = record;
    }
  }
};

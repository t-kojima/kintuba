#!/usr/bin/env node

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordEditEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
  }

  done() {
    this.rollbackDisallowFields();
    fixture.update(this.record);
  }
};

#!/usr/bin/env node

// app.record.create.show

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

#!/usr/bin/env node

// record.index.edit.submit.success
// record.create.submit.success
// record.edit.submit.success

const RecordEventObject = require('./record_event_object');

module.exports = class RecordEditSubmitSuccessEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
    this.url = null;
  }
};

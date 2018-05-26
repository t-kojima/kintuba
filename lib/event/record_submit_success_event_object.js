#!/usr/bin/env node

const RecordEventObject = require('./record_event_object');

module.exports = class RecordSubmitSuccessEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
    this.url = null;
  }

  done() {
    if (this.url) {
      // eslint-disable-next-line no-undef, no-restricted-globals
      location.href = this.url;
    }
  }
};

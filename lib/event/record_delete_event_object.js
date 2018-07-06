// app.record.detail.delete.submit
// app.record.index.delete.submit

const fixture = require('./../fixture');
const RecordEventObject = require('./record_event_object');

module.exports = class RecordDeleteEventObject extends RecordEventObject {
  constructor(event, options = {}) {
    super(event, options);
  }

  done() {
    fixture.delete(this.recordId);
  }
};

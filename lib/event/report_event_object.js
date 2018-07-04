// app.report.show

const EventObject = require('./event_object');

module.exports = class ReportEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event, options);
  }
};

const schema = require('./../schema');

module.exports = class EventObject {
  constructor(event) {
    this.appId = schema.app.appId;
    this.type = event;
  }
};

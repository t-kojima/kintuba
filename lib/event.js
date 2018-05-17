const { EventEmitter } = require('events');

module.exports = class Event extends EventEmitter {
  do(event) {
    this.emit(event, 'events');
  }
};

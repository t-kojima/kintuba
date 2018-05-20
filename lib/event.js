const { EventEmitter } = require('events');
const settings = require('./settings');

const DEFAULT_VIEW_ID = '20';

class EventObject {
  constructor(event) {
    this.appId = settings.app.appId;
    this.type = event;
  }
}

class RecordEventObject extends EventObject {
  constructor(event, options = { recordId: '1' }) {
    super(event);

    const record = settings.records.find(a => a.$id === options.recordId);
    this.recordId = record ? record.$id : 0;
    this.record = record || {};
  }
}

class RecordsEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    this.date = null;
    this.offset = 0;

    const { views } = settings.views;
    const view = Object.keys(views)
      .map(key => views[key])
      .find(item => item.id === options.viewId);
    this.viewId = view ? view.id : DEFAULT_VIEW_ID;
    this.viewName = view ? view.name : '（すべて）';
    this.viewType = view ? view.type.toLowerCase() : 'list';

    this.size = settings.records.length;
    this.records = settings.records;
  }
}

// eslint-disable-next-line no-unused-vars
const app = {
  record: {
    index: {
      show: (event, options) => new RecordsEventObject(event, options),
      edit: {
        show: (event, options) => new RecordEventObject(event, options),
      },
    },
  },
  report: {
    show: () => {},
  },
};

module.exports = class Event extends EventEmitter {
  do(event, options) {
    global.kintone.location = event;
    if (
      event.match(/^app\.(record|report)(\.(index|detail))?(\.(create|edit|delete|print))?(\.(show|change|submit|process))?(\.(success|proceed))?$/)
    ) {
      // eslint-disable-next-line no-eval
      const func = eval(`${event}`);
      this.emit(event, func(event, options));
    }
  }
};

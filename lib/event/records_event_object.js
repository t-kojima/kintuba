const fixture = require('./../fixture');
const schema = require('./../schema');
const EventObject = require('./event_object');

const DEFAULT_VIEW_ID = '20';

/* eslint-disable no-param-reassign */

const calendarRecords = (keyColumn, yyyymm) =>
  JSON.parse(JSON.stringify(fixture.records))
    .filter(r => r[keyColumn].value && r[keyColumn].value.startsWith(yyyymm))
    // [...record] から { date: [...record],} へ変換
    .reduce((prev, cur) => {
      if (cur[keyColumn].value) {
        const date = cur[keyColumn].value.slice(0, 10);
        if (!prev[date]) prev[date] = [];
        prev[date].push(cur);
      }
      return prev;
    }, {});

module.exports = class RecordsEventObject extends EventObject {
  constructor(event, options = {}) {
    super(event);

    const { views } = schema.views;
    const view = views
      ? Object.keys(views)
          .map(key => views[key])
          .find(item => item.id === options.viewId)
      : null;
    this.viewId = view ? view.id : DEFAULT_VIEW_ID;
    this.viewName = view ? view.name : '（すべて）';
    this.viewType = view ? view.type.toLowerCase() : 'list';

    const isCalendar = () => this.viewType === 'calendar';

    this.date = (() => {
      if (!isCalendar()) return null;
      if (options.date) return options.date;
      throw new Error('date option is required when selected calendar');
    })();

    this.offset = (() => {
      if (isCalendar()) return null;
      return options.offset ? options.offset : 0;
    })();

    this.records = (() => {
      if (isCalendar()) {
        return calendarRecords(view.date, this.date);
      }
      const limit = options.limit ? options.limit : 100;
      // record.skip(offset).take(limit)...って書きたい
      // TODO viewのfilterとsort条件の実装
      return JSON.parse(JSON.stringify(fixture.records))
        .slice(this.offset)
        .slice(0, limit);
    })();
    this.size = isCalendar() ? null : this.records.length;
  }
};

#!/usr/bin/env node

/* eslint-disable no-undef, class-methods-use-this */

const App = require('./app');
const Event = require('./event');
const schema = require('./schema');
const fixture = require('./fixture');

const api = {
  getConcurrencyLimit: () => {},
};

const hasAppRecord = event =>
  ['app.record.detail', 'app.record.edit', 'app.record.print'].some(a => event.type.startsWith(a));

const onLocationChangedEvent = (events, app) => {
  events.on('location.changed', (location, event) => {
    app.record.set(event && hasAppRecord(event) ? event.record : null);
  });
};

class Kinmock {
  constructor() {
    this.app = new App();
    this.api = api;
    this.events = new Event(schema.fields);
    onLocationChangedEvent(this.events, this.app);
  }

  loadSchema(dirname) {
    schema.loadSchema(dirname);
    this.events = new Event(schema.fields);
    onLocationChangedEvent(this.events, this.app);
  }

  loadFixture(dirname) {
    fixture.loadFixture(dirname);
  }

  loadDefault() {
    this.loadSchema();
    this.loadFixture();
  }

  getLoginUser() {
    return fixture.login;
  }

  getUiVersion() {
    return 2;
  }
}

global.kintone = new Kinmock();

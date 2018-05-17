/* eslint-disable no-undef */

const Event = require('./event');

const app = {
  getId: () => 1,
  getHeaderMenuSpaceElement: () => document.body,
};

global.kintone = {
  app,
  events: new Event(),
};

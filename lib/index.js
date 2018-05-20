/* eslint-disable no-undef */
const settings = require('./settings');
const Event = require('./event');

const app = {
  getId: () => 1,
  getHeaderMenuSpaceElement: () => document.body,
  getFieldElements: () => {},
  getHeaderSpaceElement: () => {},
  getLookupTargetAppId: () => {},
  getQuery: () => {},
  getQueryCondition: () => {},
  getRelatedRecordsTargetAppId: () => {},
  record: () => {},
};

const api = {
  getConcurrencyLimit: () => {},
};

global.kintone = {
  app,
  api,
  events: new Event(),
  getLoginUser: () => settings.login,
  getUiVersion: () => 2,
  location: null,
};

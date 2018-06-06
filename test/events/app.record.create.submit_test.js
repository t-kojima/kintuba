/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const { assert } = require('chai');

describe('app.record.create.submit', () => {
  const method = 'app.record.create.submit';
  afterEach(() => {
    kintone.events.off(method);
    kintone.loadDefault();
  });

  xdescribe('フィールドの表示／非表示を切り替える', () => {});
});

/* eslint-disable no-undef, no-param-reassign */
require('../../lib');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

describe('app.record.create.submit', () => {
  const method = 'app.record.create.submit';
  afterEach(() => {
    kintone.events.off(method);
    kintone.loadDefault();
  });

  xdescribe('フィールドの表示／非表示を切り替える', () => {});
});

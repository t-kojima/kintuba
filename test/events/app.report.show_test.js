/* eslint-disable no-undef, no-param-reassign */
require('../../.');
const fixture = require('../../fixture');

const { assert } = require('chai');

describe('app.report.show', () => {
  const method = 'app.report.show';
  beforeEach(() => fixture.load());
  afterEach(() => kintone.events.off(method));

  it('イベントが発火すること', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.equal(event.type, method);
  });

  it('レコードオブジェクトが取得できないこと', async () => {
    kintone.events.on(method, event => event);
    const event = await kintone.events.do(method);
    assert.isUndefined(event.record);
    assert.isUndefined(event.records);
  });
});
